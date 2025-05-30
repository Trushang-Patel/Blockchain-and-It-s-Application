// Importing the Hardhat Runtime Environment (HRE)
const hre = require("hardhat");

async function main() {
  // Get the deployer's account
  const [deployer] = await hre.ethers.getSigners(); // Use hre.ethers instead of ethers directly
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the contract factory for MyContract
  const MyContract = await hre.ethers.getContractFactory("MyContract");

  // Deploy the contract
  const contract = await MyContract.deploy();

  // Log the address of the deployed contract
  console.log("Contract deployed to address:", contract.address);
}

main()
  .then(() => process.exit(0)) // Exit with a success code
  .catch((error) => {
    console.error(error);  // Log any errors that occur
    process.exit(1); // Exit with an error code
  });
