// const Pyramyd = artifacts.require("Pyramyd");
// const WhoIsSamot = artifacts.require("WhoIsSamot");
// const GoldenToken = artifacts.require("GoldenToken");
// const SamotToken = artifacts.require("SamotToken");
const SamotStaking = artifacts.require("SamotStaking");
// const lindanene = artifacts.require("lindanene");
// const BurnTesting = artifacts.require("BurnTesting");


module.exports = async function (deployer, network, address) {
    let proxyRegistryAddress = "";
    if (network === 'rinkeby') {
        proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
    } else {
        proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
    }
    // await deployer.deploy(WhoIsSamot, proxyRegistryAddress, "Who Is Samot?", "SAMOTTEST", whitelist);
    // await deployer.deploy(Pyramyd, proxyRegistryAddress, "PYRAMYD", "PYRMDTEST");
    // await deployer.deploy(SamotToken, "Samot Token", "SAMOT", "0x49fDbfa1126638CE7eF2CA1A0f7759109f12595d");
    // await deployer.deploy(GoldenToken, "Samot Golden Coin", "SGC","https://samotclub.mypinata.cloud/ipfs/QmTSjZpbh6cX9ZhWp3w21R6ZMdPeBzFda8CdhtrgRxPJtS",proxyRegistryAddress);
    await deployer.deploy(SamotStaking, "0x49fDbfa1126638CE7eF2CA1A0f7759109f12595d", 161290322600000, "0x68598E70eCBafC9fBc60185051F765B71e0AdEa6", "0x7cca1e4879a62A4B6173FAF0B865217722a47751", 241935483900000);
    // await deployer.deploy(lindanene, "Linda Nene", "LN", "https://samotclub.mypinata.cloud/ipfs/QmStiE4GcNEejF9BEWMZAgpbr3BoC2z4w8WBzNJyFpA8vN", proxyRegistryAddress);
    // await deployer.deploy(BurnTesting, proxyRegistryAddress, "BURN", "BURNTESTING");

};