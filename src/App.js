import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState} from "react";
import { ethers } from 'ethers';
import myEpicNft from './MyEpicNFT.json';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0x14e7a0c2e847472bCC4c6B0fc7122F321C1Eee95";

const App = () => {

  /*
  * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  
  /* Make sure we have access 
      to window.Ethereum
  */
  // Got to make sure this is async
  const checkIfWalletIsConnected = async () => {

    const {ethereum} = window;

    if(!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    };

    // Check if were authorized to access the users wallet //
    const accounts = await ethereum.request({method: 'eth_accounts'});


    /* User can have multiple authorized accounts, we grab the first one if its there! */
    if(accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an athorized account:", account);
      setCurrentAccount(account);

      //Setup listener! This is for the case where a user comes to our site and ALREADY had their wallet connected + authorized
      setupEventListener();
    } else {
      console.log("No authorized account found")
    };

  };

  // Implement your connectWallet method here
  const connectWallet = async() => {

    try {
      const {ethereum} = window;

      if(!ethereum) {
        alert("Get metamask!");
        return
      };

      // Fancy method to request access to account
      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      // This is a promising returning function so we use await here


      //* Boom! This should print out public address once we authorize Metamask.
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site and connected their wallet for the first time.
      setupEventListener();

    } catch(error) {
      console.log(error);
    }
    
  };

  //Setup our listener.
  const setupEventListener = async() => {
    // Most of this looks the same as our function askContractToMintNft
    try{  
      const {ethereum} = window;

      if(ethereum) {
        // same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        //THIS IS THE MAGIC SAUCE.
        // This will esentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpictNFTMinted", (from, tokenId)  => {
          console.log(from, tokenId.toNumber());
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on Opensea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()} `);
        });

        console.log("Setup even listener!");

        
      } else {
        console.log("Ethereum object doesn't exist!");
      };

    } catch(error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const {ethereum} = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(  CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log('Mining.... please wait');
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        


      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error) {
      console.log(error);
    };
  };
  
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  )

   /* This is our function when the page loads */
  useEffect(()=> {checkIfWalletIsConnected();}, []);

  

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
            {currentAccount === "" ? renderNotConnectedContainer(): renderMintUI()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;