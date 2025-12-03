require("@nomicfoundation/hardhat-toolbox");

// Dán Private Key MỚI (cái mà bạn đã nạp tiền Faucet thành công) vào đây
const PRIVATE_KEY = "0xe2a792a0acd04b02baf3dc407fb2af1db11e525d29f228dcb2ef6a541e3416d1"; // <--- THAY BẰNG KEY CỦA BẠN (VD: 0x6233...)

module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia.publicnode.com", // Hoặc https://1rpc.io/sepolia
      accounts: [PRIVATE_KEY],
    },
  },
};