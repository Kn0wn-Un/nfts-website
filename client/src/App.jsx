import React, { useState, useEffect } from 'react';
import './styles/App.css';
import NeonSunImg from './NeonSunExample';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from 'ethers';
import myEpicNft from './utils/MyEpicNFT.json';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
	const CONTRACT_ADDRESS = '0x143D8df80210DcAB1c31647bEaa07Bd54B0589a8';
	const [currentAccount, setCurrentAccount] = useState('');
	const [totalSupply, setTotalSupply] = useState(0);
	const [userNftToken, setUserNFt] = useState(0);
	const [isMinting, setIsMinting] = useState(false);

	const checkIfWalletIsConnected = async () => {
		/*
		 * First make sure we have access to window.ethereum
		 */
		const { ethereum } = window;

		if (!ethereum) {
			console.log('Make sure you have metamask!');
			return;
		} else {
			console.log('We have the ethereum object', ethereum);
		}
		/*
		 * Check if we're authorized to access the user's wallet
		 */
		const accounts = await ethereum.request({ method: 'eth_accounts' });

		/*
		 * User can have multiple authorized accounts, we grab the first one if its there!
		 */
		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setCurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}
	};

	// Render Methods
	const renderNotConnectedContainer = () => (
		<button
			className="cta-button connect-wallet-button"
			onClick={connectWallet}
		>
			Connect to Wallet
		</button>
	);

	/*
	 * Implement your connectWallet method here
	 */
	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert('Get MetaMask!');
				return;
			}

			/*
			 * Fancy method to request access to account.
			 */
			const accounts = await ethereum.request({
				method: 'eth_requestAccounts',
			});

			/*
			 * Boom! This should print out public address once we authorize Metamask.
			 */
			console.log('Connected', accounts[0]);
			setCurrentAccount(accounts[0]);

			let chainId = await ethereum.request({ method: 'eth_chainId' });
			console.log('Connected to chain ' + chainId);

			// String, hex code of the chainId of the Rinkebey test network
			const rinkebyChainId = '0x4';
			if (chainId !== rinkebyChainId) {
				alert('You are not connected to the Rinkeby Test Network!');
			}

			setupEventListener();
		} catch (error) {
			console.log(error);
		}
	};

	// Setup our listener.
	const setupEventListener = async () => {
		// Most of this looks the same as our function askContractToMintNft
		try {
			const { ethereum } = window;

			if (ethereum) {
				// Same stuff again
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const connectedContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					myEpicNft.abi,
					signer
				);

				// THIS IS THE MAGIC SAUCE.
				// This will essentially "capture" our event when our contract throws it.
				// If you're familiar with webhooks, it's very similar to that!
				connectedContract.on('NewEpicNFTMinted', async (from, tokenId) => {
					console.log(from, tokenId.toNumber());
					const ts = await connectedContract.totalSupply();
					setTotalSupply(ts.toNumber());
					setIsMinting(false);
					setUserNFt(tokenId.toNumber());
					alert(
						`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
					);
				});

				console.log('Setup event listener!');
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const askContractToMintNft = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const connectedContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					myEpicNft.abi,
					signer
				);

				console.log('Going to pop wallet now to pay gas...');
				let nftTxn = await connectedContract.makeAnEpicNFT();

				setIsMinting(true);
				console.log('Mining...please wait.');
				await nftTxn.wait();

				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
				);
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getInitialDetails = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				// Same stuff again
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const connectedContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					myEpicNft.abi,
					signer
				);

				const ts = await connectedContract.totalSupply();
				setTotalSupply(ts.toNumber());

				const userNFT = await connectedContract.getUserNft();
				if (userNFT.toNumber()) {
					setUserNFt(userNFT.toNumber());
				}
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	/*
	 * This runs our function when the page loads.
	 */
	useEffect(() => {
		checkIfWalletIsConnected();
		getInitialDetails();
	}, []);

	useEffect(() => {
		getInitialDetails();
	}, [currentAccount]);

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<p className="header gradient-text">Neon Sun NFT Collection</p>
					<NeonSunImg />
					<div className="sub-text">
						Each unique. Each beautiful. Discover your NFT today.
						<div>{totalSupply} out of 50 NFTs minted!</div>
					</div>
					{currentAccount === '' ? (
						renderNotConnectedContainer()
					) : userNftToken ? (
						<div className="sub-text">
							Congratulations, you own an Neon Sun NFT!{' '}
							<a
								href={`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${userNftToken}`}
							>
								🌊 View Collection on OpenSea
							</a>
							(It may take a while)
						</div>
					) : (
						<button
							onClick={askContractToMintNft}
							className="cta-button connect-wallet-button"
							disabled={userNftToken}
						>
							{isMinting ? 'Minting...(may take some time)' : 'Mint NFT'}
						</button>
					)}
				</div>
				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built on @${TWITTER_HANDLE}`}</a>
					<a
						className="footer-text"
						href="https://github.com/Kn0wn-Un"
						target="_blank"
						rel="noreferrer"
					>
						{' '}
						by Kn0wn-Un
					</a>
				</div>
			</div>
		</div>
	);
};

export default App;
