// const Pyramyd = artifacts.require("Pyramyd");
// const WhoIsSamot = artifacts.require("WhoIsSamot");
// const GoldenToken = artifacts.require("GoldenToken");
// const SamotToken = artifacts.require("SamotToken");
const SamotStaking = artifacts.require("SamotStaking");
// const lindanene = artifacts.require("lindanene");

module.exports = async function (deployer, network, address) {
    let proxyRegistryAddress = "";
    if (network === 'rinkeby') {
        proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
    } else {
        proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
    }
    // await deployer.deploy(WhoIsSamot, proxyRegistryAddress, "Who Is Samot?", "SAMOTTEST", whitelist);
    // await deployer.deploy(Pyramyd, proxyRegistryAddress, "PYRAMYD", "PYRMDTEST");
    // await deployer.deploy(SamotToken, "Samot Token", "$AMOT", "0x83C26562cE37959b870240B9c06b3e7fd72Edd8c");
    // await deployer.deploy(GoldenToken, "Samot Golden Coin", "SGC","https://samotclub.mypinata.cloud/ipfs/QmTSjZpbh6cX9ZhWp3w21R6ZMdPeBzFda8CdhtrgRxPJtS",proxyRegistryAddress);
    await deployer.deploy(SamotStaking, "0x83C26562cE37959b870240B9c06b3e7fd72Edd8c", 161290322600000, "0xB3a7c2a8037106228Aecfd8B9333BE291ce27c3f", "0x8040Eaf450e42b1784809cE9344FB17A7674cFEC", 241935483900000);
    // await deployer.deploy(lindanene, "Linda Nene", "LN", "https://samotclub.mypinata.cloud/ipfs/QmStiE4GcNEejF9BEWMZAgpbr3BoC2z4w8WBzNJyFpA8vN", proxyRegistryAddress);
};