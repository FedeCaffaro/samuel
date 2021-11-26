// const Pyramyd = artifacts.require("Pyramyd");
// const SamotToken = artifacts.require("SamotToken");
// const WhoIsSamot = artifacts.require("WhoIsSamot");
// const whitelist = require("./whitelist.json")
const GoldenToken = artifacts.require("GoldenToken");

module.exports = async function (deployer, network, address) {
    let proxyRegistryAddress = "";
    if (network === 'rinkeby') {
        proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
    } else {
        proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
    }
    // await deployer.deploy(WhoIsSamot, proxyRegistryAddress, "Who Is Samot?", "SAMOTTEST", whitelist);
    // await deployer.deploy(Pyramyd, proxyRegistryAddress, "PYRAMYD", "PYRMDTEST");
    // await deployer.deploy(SamotToken, "Samot Token", "$AMOTTEST");
    await deployer.deploy(GoldenToken, "Samot Golden Coin", "SGC","https://samotclub.mypinata.cloud/ipfs/QmTSjZpbh6cX9ZhWp3w21R6ZMdPeBzFda8CdhtrgRxPJtS",proxyRegistryAddress);
};