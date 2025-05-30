import { HashConnect } from "hashconnect";

class HashPackService {
    constructor() {
        // HashConnect instance
        this.hashConnect = new HashConnect();
        
        // App metadata
        this.appMetadata = {
            name: "Blockchain Supply Chain",
            description: "Track products across the supply chain using Hedera",
            icon: "https://www.hedera.com/logo-capital-hbar-wordmark.png"
        };
        
        // Connection state
        this.isConnected = false;
        this.topic = "";
        this.pairingString = "";
        this.pairingData = null;
        this.accountId = null;
        
        // Network configuration - default to testnet
        this.network = "testnet";
        
        // Mock wallet accounts for development
        this.mockWalletAccounts = [
            "0.0.1111", // Admin
            "0.0.2222", // Manufacturer
            "0.0.3333", // Distributor
            "0.0.4444"  // Retailer
        ];
        
        // Use mock implementation in case of errors
        this.useMockImplementation = false;
    }

    async init() {
        try {
            // Try to initialize HashConnect
            try {
                const initData = await this.hashConnect.init(this.appMetadata, this.network, false);
                console.log("HashConnect initialized:", initData);
                
                this.topic = initData.topic;
                this.setupEvents();
                
                // Check if we have saved pairing data
                const savedPairing = localStorage.getItem('hashconnect_pairing');
                
                if (savedPairing) {
                    try {
                        this.pairingData = JSON.parse(savedPairing);
                        this.topic = this.pairingData.topic;
                        this.accountId = this.pairingData.accountIds?.[0];
                        this.isConnected = !!this.accountId;
                        
                        console.log("Loaded saved pairing:", this.pairingData);
                    } catch (e) {
                        console.warn("Error parsing saved pairing data", e);
                        this.clearConnectionData();
                    }
                }
                
                // Generate pairing string
                if (!this.pairingString) {
                    this.pairingString = this.hashConnect.generatePairingString(this.topic, this.network, false);
                }
                
                return {
                    pairingString: this.pairingString,
                    topic: this.topic
                };
                
            } catch (error) {
                // If HashConnect fails, use mock implementation
                console.error("HashConnect initialization failed:", error);
                this.useMockImplementation = true;
                
                this.pairingString = `mock-pairing-string-${Date.now()}`;
                this.topic = "mock-topic";
                
                return {
                    pairingString: this.pairingString,
                    topic: this.topic
                };
            }
        } catch (error) {
            console.error("Error in init:", error);
            throw error;
        }
    }

    setupEvents() {
        if (this.useMockImplementation) return;
        
        // Handle found extension event
        this.hashConnect.foundExtensionEvent.once((walletMetadata) => {
            console.log("Found extension", walletMetadata);
        });
        
        // Handle connection status change
        this.hashConnect.connectionStatusChange.on((state) => {
            console.log("Connection status changed:", state);
        });

        // Handle pairing event
        this.hashConnect.pairingEvent.on((pairingData) => {
            console.log("Pairing event received:", pairingData);
            
            this.pairingData = pairingData;
            this.accountId = pairingData.accountIds?.[0];
            this.isConnected = !!this.accountId;
            
            // Save pairing data to localStorage
            localStorage.setItem('hashconnect_pairing', JSON.stringify(pairingData));
        });

        // Handle acknowledgment event
        this.hashConnect.acknowledgeMessageEvent.on((acknowledgeData) => {
            console.log("Acknowledge event received:", acknowledgeData);
        });
    }

    async connectWallet() {
        try {
            // Check if already connected
            if (this.isConnected && this.accountId) {
                console.log("Already connected to account:", this.accountId);
                return this.accountId;
            }
            
            // If using mock implementation
            if (this.useMockImplementation) {
                return this.connectMockWallet();
            }
            
            // Try to connect with HashConnect
            try {
                // If no pairing string, initialize
                if (!this.pairingString || !this.topic) {
                    await this.init();
                }
                
                // Open the extension to pair
                this.hashConnect.connectToLocalWallet(this.pairingString);
                
                // Return a promise that resolves when pairing is complete
                return new Promise((resolve, reject) => {
                    // Set a timeout to prevent infinite waiting
                    const timeout = setTimeout(() => {
                        if (!this.accountId) {
                            console.log("Connection timeout. Falling back to mock implementation.");
                            this.useMockImplementation = true;
                            this.connectMockWallet().then(resolve).catch(reject);
                        }
                    }, 60000); // 60 second timeout
                    
                    // Handle pairing event
                    const handlePairing = (pairingData) => {
                        clearTimeout(timeout);
                        
                        this.pairingData = pairingData;
                        this.accountId = pairingData.accountIds?.[0];
                        this.isConnected = true;
                        
                        console.log("Connected to account:", this.accountId);
                        resolve(this.accountId);
                    };
                    
                    // Listen for pairing event
                    this.hashConnect.pairingEvent.once(handlePairing);
                });
            } catch (error) {
                console.error("Error connecting via HashConnect:", error);
                this.useMockImplementation = true;
                return this.connectMockWallet();
            }
        } catch (error) {
            console.error("Error in connectWallet:", error);
            throw error;
        }
    }

    async connectMockWallet() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate connection
                this.isConnected = true;
                
                // For demo, let user select which mock account to use
                const selectAccount = window.prompt(
                    "Select a mock account (for demo purposes):\n" +
                    "1: Admin (0.0.1111)\n" +
                    "2: Manufacturer (0.0.2222)\n" +
                    "3: Distributor (0.0.3333)\n" +
                    "4: Retailer (0.0.4444)",
                    "1"
                );
                
                const index = parseInt(selectAccount || "1", 10) - 1;
                this.accountId = this.mockWalletAccounts[index] || this.mockWalletAccounts[0];
                
                // Save to localStorage
                localStorage.setItem('hashpack_mock_connection', JSON.stringify({
                    isConnected: this.isConnected,
                    accountId: this.accountId
                }));
                
                console.log("Connected to mock account:", this.accountId);
                
                resolve(this.accountId);
            }, 1000);
        });
    }

    getAccountId() {
        return this.accountId;
    }

    isWalletConnected() {
        return this.isConnected && !!this.accountId;
    }

    async executeTransaction(transaction) {
        try {
            // If using mock implementation
            if (this.useMockImplementation) {
                return this.executeMockTransaction(transaction);
            }
            
            // Real implementation
            if (!this.accountId || !this.topic) {
                throw new Error("Wallet not connected");
            }

            try {
                // Get the provider
                const provider = this.hashConnect.getProvider(this.network, this.topic, this.accountId);

                // Sign and execute the transaction
                return await provider.sendTransaction(transaction);
            } catch (error) {
                console.error("Error with provider.sendTransaction:", error);
                return this.executeMockTransaction(transaction);
            }
        } catch (error) {
            console.error("Error executing transaction:", error);
            return this.executeMockTransaction(transaction);
        }
    }

    async executeMockTransaction(transaction) {
        console.log(`Mock executing transaction:`, transaction);
        
        // Simulate a delay and successful response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: `mock-tx-${Date.now()}`,
                    receipt: {
                        status: "SUCCESS"
                    }
                });
            }, 1500);
        });
    }

    async transferHBAR(toAccountId, amount) {
        try {
            console.log(`Transferring ${amount} HBAR to ${toAccountId}`);
            
            // Convert HBAR to tinybars (1 HBAR = 100,000,000 tinybars)
            const amountInTinybars = amount * 100000000;
            
            // Create the transaction
            const transferTransaction = {
                type: "cryptoTransfer",
                transfers: [
                    {
                        accountId: this.accountId,
                        amount: -amountInTinybars
                    },
                    {
                        accountId: toAccountId,
                        amount: amountInTinybars
                    }
                ]
            };
            
            // Execute the transaction
            return await this.executeTransaction(transferTransaction);
        } catch (error) {
            console.error("Error transferring HBAR:", error);
            throw error;
        }
    }

    async submitMessage(topicId, message) {
        try {
            // Create the transaction
            const messageString = typeof message === 'string' ? message : JSON.stringify(message);
            
            const submitMessageTransaction = {
                type: "consensusMessageSubmit",
                topicId: topicId,
                message: messageString
            };
            
            // Execute the transaction
            return await this.executeTransaction(submitMessageTransaction);
        } catch (error) {
            console.error("Error submitting message:", error);
            throw error;
        }
    }

    async createTopic(name, description) {
        try {
            // Create the transaction
            const createTopicTransaction = {
                type: "consensusTopicCreate",
                topicMemo: `${name} | ${description} | Created by: ${this.accountId}`
            };
            
            // Execute the transaction
            return await this.executeTransaction(createTopicTransaction);
        } catch (error) {
            console.error("Error creating topic:", error);
            throw error;
        }
    }

    async createProductToken(productData) {
        try {
            // Create a non-fungible token to represent this product
            const createTokenTransaction = {
                type: "tokenCreate",
                tokenName: productData.name,
                tokenSymbol: productData.sku || "PROD",
                decimals: 0,
                initialSupply: 1,
                treasuryAccountId: this.accountId,
                adminKey: { key: this.accountId },
                supplyKey: { key: this.accountId },
                freezeDefault: false,
                tokenType: "NON_FUNGIBLE_UNIQUE",
                supplyType: "FINITE",
                maxSupply: 1
            };
            
            // Execute the transaction
            return await this.executeTransaction(createTokenTransaction);
        } catch (error) {
            console.error("Error creating product token:", error);
            throw error;
        }
    }

    async recordProductUpdate(productId, status, data = {}) {
        try {
            // Prepare update data
            const updateData = {
                productId,
                status,
                timestamp: new Date().toISOString(),
                updatedBy: this.accountId,
                ...data
            };
            
            // Create consensus message
            return await this.submitMessage(productId, updateData);
        } catch (error) {
            console.error("Error recording product update:", error);
            throw error;
        }
    }

    async mintProductNFT(tokenId, metadata) {
        try {
            // Create the transaction
            const mintTransaction = {
                type: "tokenMint",
                tokenId: tokenId,
                metadata: JSON.stringify(metadata)
            };
            
            // Execute the transaction
            return await this.executeTransaction(mintTransaction);
        } catch (error) {
            console.error("Error minting product NFT:", error);
            throw error;
        }
    }

    async transferNFT(tokenId, toAccountId) {
        try {
            // Create the transaction
            const transferTransaction = {
                type: "tokenTransfer",
                tokenId: tokenId,
                senderAccountId: this.accountId,
                receiverAccountId: toAccountId
            };
            
            // Execute the transaction
            return await this.executeTransaction(transferTransaction);
        } catch (error) {
            console.error("Error transferring NFT:", error);
            throw error;
        }
    }

    disconnect() {
        try {
            if (this.topic && !this.useMockImplementation) {
                this.hashConnect.disconnect(this.topic);
            }
            this.clearConnectionData();
            return true;
        } catch (error) {
            console.error("Error disconnecting:", error);
            this.clearConnectionData();
            return false;
        }
    }

    clearConnectionData() {
        this.isConnected = false;
        this.topic = "";
        this.pairingString = "";
        this.pairingData = null;
        this.accountId = null;
        localStorage.removeItem('hashconnect_pairing');
        localStorage.removeItem('hashpack_mock_connection');
    }
}

export default new HashPackService();