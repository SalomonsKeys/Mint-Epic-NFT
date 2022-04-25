

const main = async () => {

    const Contract = await hre.ethers.getContractFactory("MyEpicNFT");
    const contract = await Contract.deploy('Bobby');
    await contract.deployed();
    console.log("Contract deployed to", contract.address);

    return contract;
};

async function functionCaller(contract) {
   await contract.makeAnEpicNFT();
   console.log("minted NFT 1");
}


main().then(functionCaller);




