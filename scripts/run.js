
const main = async () => {
    const Contract = await hre.ethers.getContractFactory('MyEpicNFT');
    const contract = await Contract.deploy();
    await contract.deployed();
    console.log("Contract deployed to:", contract.address);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch(error) {
        console.log(error);
        process.exit(1);
    };
};

runMain();