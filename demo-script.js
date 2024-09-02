const { Network, Alchemy, Utils } = require("alchemy-sdk");

const settings = {
  apiKey: "E_KwdeFAcI1PcWB3CF0b6L2bIpDXLGAS", // Replace with your API key
  network: Network.FANTOM_TESTNET, // Replace with your Network
};

const alchemy = new Alchemy(settings);

async function main() {
  const gasEstimate = await alchemy.core.estimateGas({
    to: "vitalik.eth",
    // parsing 1 ETH to wei using Utils
    value: Utils.parseEther("1.0"),
  });
  console.log(gasEstimate);
}

main();



