# Hedera_Training

## Setup Instructions

1. Initialize the Node.js project:
```sh
npm init -y
```

2. Install required dependencies:
```sh
# Install dotenv for environment variables
npm install dotenv

# Install Hedera SDK
npm install --save @hashgraph/sdk
```

## Account Creation Script

The `createAccount.js` script demonstrates how to:
- Connect to Hedera Testnet
- Create a new account with ECDSA key pair
- Set initial balance of 10 HBAR
- Set EVM address alias
- Get transaction receipt and details

### Usage

1. Create `createAccount.js` with the provided code
2. Update the following constants with your Testnet account details:
```javascript
const MY_ACCOUNT_ID = AccountId.fromString("your-account-id");
const MY_PRIVATE_KEY = PrivateKey.fromStringED25519("your-private-key");
```

3. Run the script:
```sh
node createAccount.js
```

### Output
The script will output:
- Transaction receipt status
- Transaction ID
- Hashscan URL for transaction
- New account ID
- Private key
- Public key

### Important Notes
- Keep your private keys secure
- This script uses the Hedera Testnet
- Initial balance is set to 10 HBAR
- The account is created with an ECDSA key pair
- An EVM address alias is set for the account

## Resources
- [Hedera Portal](https://portal.hedera.com)
- [Hashscan Explorer](https://hashscan.io/testnet)
- [Hedera JavaScript SDK Documentation](https://docs.hedera.com/sdk)