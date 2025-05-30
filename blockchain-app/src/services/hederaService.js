// This is a mock service for frontend development
// In production, you would use a backend API to interact with Hedera
class HederaMockService {
    constructor() {
      // Mock storage
      this.products = {};
      this.stakeholders = {};
      
      // Mock contract ID
      this.contractId = "0.0.12345"; // This would be your actual contract ID in production
      
      // Initialize with some demo data
      this.initializeDemoData();
    }
    
    initializeDemoData() {
      // Add some mock stakeholders
      this.stakeholders = {
        "0.0.1111": {
          accountId: "0.0.1111",
          name: "Acme Manufacturing",
          role: 0, // Manufacturer
          isActive: true
        },
        "0.0.2222": {
          accountId: "0.0.2222",
          name: "Global Distribution Co",
          role: 1, // Distributor
          isActive: true
        },
        "0.0.3333": {
          accountId: "0.0.3333",
          name: "City Retail Store",
          role: 2, // Retailer
          isActive: true
        },
        "0.0.4444": {
          accountId: "0.0.4444",
          name: "Metro Retail Store",
          role: 2, // Retailer
          isActive: true
        }
      };
      
      // Add some mock products
      this.products = {
        "PROD001": {
          productId: "PROD001",
          name: "Premium Smartphone",
          description: "High-end smartphone with advanced features",
          manufacturer: "0.0.1111",
          currentOwner: "0.0.2222",
          status: 3, // ReceivedByDistributor
          timestamp: Date.now() - 86400000, // 1 day ago
          metadata: JSON.stringify({
            model: "X2000",
            color: "Black",
            weight: "180g",
            dimensions: "150x70x8mm"
          })
        },
        "PROD002": {
          productId: "PROD002",
          name: "Wireless Headphones",
          description: "Noise-canceling wireless headphones",
          manufacturer: "0.0.1111",
          currentOwner: "0.0.1111",
          status: 1, // ManufacturingComplete
          timestamp: Date.now() - 172800000, // 2 days ago
          metadata: JSON.stringify({
            model: "AudioPro",
            color: "White",
            batteryLife: "20 hours"
          })
        }
      };
      
      // Add tracking history for products
      this.trackingHistory = {
        "PROD001": [
          {
            actor: "0.0.1111",
            status: 0, // Created
            timestamp: Date.now() - 259200000, // 3 days ago
            location: "Factory 1, Building A",
            comments: "Product created and registered"
          },
          {
            actor: "0.0.1111",
            status: 1, // ManufacturingComplete
            timestamp: Date.now() - 172800000, // 2 days ago
            location: "Factory 1, Building A",
            comments: "Manufacturing completed, ready for shipping"
          },
          {
            actor: "0.0.1111",
            status: 2, // ShippedToDistributor
            timestamp: Date.now() - 129600000, // 1.5 days ago
            location: "Factory 1, Shipping Dock",
            comments: "Product shipped to distributor"
          },
          {
            actor: "0.0.2222",
            status: 3, // ReceivedByDistributor
            timestamp: Date.now() - 86400000, // 1 day ago
            location: "Distribution Center 3",
            comments: "Product received at distribution center"
          }
        ],
        "PROD002": [
          {
            actor: "0.0.1111",
            status: 0, // Created
            timestamp: Date.now() - 259200000, // 3 days ago
            location: "Factory 1, Building B",
            comments: "Product created and registered"
          },
          {
            actor: "0.0.1111",
            status: 1, // ManufacturingComplete
            timestamp: Date.now() - 172800000, // 2 days ago
            location: "Factory 1, Building B",
            comments: "Manufacturing completed, ready for shipping"
          }
        ]
      };
    }
    
    // Get product details
    getProduct(productId) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const product = this.products[productId];
          if (product) {
            resolve(product);
          } else {
            reject(new Error("Product not found"));
          }
        }, 500); // Simulate network delay
      });
    }
    
    // Get tracking history for a product
    getTrackingHistory(productId) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const history = this.trackingHistory[productId];
          if (history) {
            resolve(history);
          } else {
            reject(new Error("Product history not found"));
          }
        }, 500);
      });
    }
    
    // Create a new product
    createProduct(productData, accountId) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const { productId, name, description, metadata } = productData;
          
          if (this.products[productId]) {
            reject(new Error("Product ID already exists"));
            return;
          }
          
          const newProduct = {
            productId,
            name,
            description,
            manufacturer: accountId,
            currentOwner: accountId,
            status: 0, // Created
            timestamp: Date.now(),
            metadata: JSON.stringify(metadata || {})
          };
          
          this.products[productId] = newProduct;
          
          // Add initial tracking event
          this.trackingHistory[productId] = [
            {
              actor: accountId,
              status: 0, // Created
              timestamp: Date.now(),
              location: productData.location || "Unspecified",
              comments: "Product created and registered"
            }
          ];
          
          resolve(newProduct);
        }, 800);
      });
    }
    
    // Update product status
    updateProductStatus(productId, newStatus, location, comments, accountId) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const product = this.products[productId];
          if (!product) {
            reject(new Error("Product not found"));
            return;
          }
          
          if (product.currentOwner !== accountId) {
            reject(new Error("Not authorized to update this product"));
            return;
          }
          
          if (newStatus <= product.status) {
            reject(new Error("New status must be an advancement in the supply chain"));
            return;
          }
          
          // Update product status
          this.products[productId] = {
            ...product,
            status: newStatus,
            timestamp: Date.now()
          };
          
          // Add tracking event
          if (!this.trackingHistory[productId]) {
            this.trackingHistory[productId] = [];
          }
          
          this.trackingHistory[productId].push({
            actor: accountId,
            status: newStatus,
            timestamp: Date.now(),
            location: location || "Unspecified",
            comments: comments || ""
          });
          
          resolve(this.products[productId]);
        }, 800);
      });
    }
    
    // Get stakeholder details
    getStakeholder(accountId) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const stakeholder = this.stakeholders[accountId];
          if (stakeholder) {
            resolve(stakeholder);
          } else {
            reject(new Error("Stakeholder not found"));
          }
        }, 500);
      });
    }
  }
  
  export default new HederaMockService();