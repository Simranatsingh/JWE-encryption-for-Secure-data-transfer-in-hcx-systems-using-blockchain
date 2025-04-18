async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const ReportStorage = await ethers.getContractFactory("ReportStorage");
  const reportStorage = await ReportStorage.deploy();

  await reportStorage.deployed();

  console.log("ReportStorage deployed to:", reportStorage.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 