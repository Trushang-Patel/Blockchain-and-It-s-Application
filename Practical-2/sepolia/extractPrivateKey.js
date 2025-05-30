const keythereum = require("keythereum");

const keyObject = {
  "address": "8212575e17f3fc9a95dbe12157ddeed221db3f4d",
  "crypto": {
    "cipher": "aes-128-ctr",
    "ciphertext": "c762dbae7f5f0b4c92aee20f12d83568cab4022d2d914155c071af48ac50d754",
    "cipherparams": {
      "iv": "2f534841ea237c00796f96fd1fc16ac9"
    },
    "kdf": "scrypt",
    "kdfparams": {
      "dklen": 32,
      "n": 262144,
      "p": 1,
      "r": 8,
      "salt": "16ef7ddffb092d55e87beddd9bf390c099eb7a16a11c7853d9851befeb6ae366"
    },
    "mac": "7b5d31b7f2da77430a1db86b430e8ada041015ff7f34b68e557794ccd87aae4c"
  },
  "id": "50253c3b-8545-4d8d-8c6c-171053ef24c8",
  "version": 3
};

// Replace this with your actual password used during account creation
const password = "Trushang@28";

keythereum.recover(password, keyObject, function (privateKey) {
  console.log("Your private key is:", privateKey.toString("hex"));
});