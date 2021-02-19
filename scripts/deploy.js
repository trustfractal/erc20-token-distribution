async function main() {
  // We get the contract to deploy
  const one_month = 30 * 24 * 60 * 60;

  const start = Math.round(Date.now() / 1000) - 3 * one_month + 60*60;
  const cliff = one_month;
  const duration = 3 * one_month;

  const FCLDistribution = await hre.ethers.getContractFactory("TokenVesting");
  const fclDistribution = await FCLDistribution.deploy(
    "0x6a7eB27407a50a4eb9d015EA2B0F2e1BcC724461",
    start,
    cliff,
    duration,
    false,
  );

  console.log("beneficiary: ", "0x6a7eB27407a50a4eb9d015EA2B0F2e1BcC724461");
  console.log("start: ", start);
  console.log("cliff: ", cliff);
  console.log("duration: ", duration);

  console.log("Deploying FCLDistribution...");

  await fclDistribution.deployed();

  console.log("FCLDistribution deployed to:", fclDistribution.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
