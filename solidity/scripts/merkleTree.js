const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

let whitelistAddresses = [
    "0x399Db9b924bC348BfC3bD777817631eb5A79b152",
    "0x547b4BF7f39FAE562d2d0d5CFc329B05ec3694F2",
    "0xD9CC8af4E8ac5Cb5e7DdFffD138A58Bac49dAEd5"
]

const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});

const rootHash = merkleTree.getRoot()

console.log("Whitelist merkle tree\n",merkleTree.toString());
