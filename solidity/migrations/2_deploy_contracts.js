//const WhoIsSamot = artifacts.require("WhoIsSamot");
const SamotToken = artifacts.require("SamotToken");
const whitelist = require("./whitelist.json")

module.exports = async function (deployer, network, address) {
    let proxyRegistryAddress = "";
    if (network === 'rinkeby') {
        proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
    } else {
        proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
    }
    //await deployer.deploy(WhoIsSamot, proxyRegistryAddress, whitelist);
    await deployer.deploy(SamotToken, "Samot Token", "SAMOT");
};