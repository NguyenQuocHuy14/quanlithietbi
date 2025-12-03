const fs = require("fs");

async function main() {
  const EquipmentLog = await ethers.getContractFactory("EquipmentLog");
  const equipmentLog = await EquipmentLog.deploy();
  await equipmentLog.waitForDeployment();

  const address = await equipmentLog.getAddress();
  console.log("✅ EquipmentLog deployed at:", address);

  // Lưu contract info cho backend/frontend
  const contractInfo = {
    address,
    abi: JSON.parse(equipmentLog.interface.formatJson()),
  };

  fs.writeFileSync(
    "deployedContract.json",
    JSON.stringify(contractInfo, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
