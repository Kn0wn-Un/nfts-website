const main = async () => {
	const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
	const nftContract = await nftContractFactory.deploy();
	await nftContract.deployed();
	console.log('Contract deployed to:', nftContract.address);

	let userNFT = await nftContract.getUserNft();
	console.log(userNFT.toNumber());

	// Call the function.
	let txn = await nftContract.makeAnEpicNFT();
	// Wait for it to be mined.
	await txn.wait();

	const totalSupply = await nftContract.totalSupply();
	console.log(totalSupply.toString());

	userNFT = await nftContract.getUserNft();
	console.log(userNFT.toNumber());
};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

runMain();
