// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "hardhat/console.sol";


contract MyEpicNFT is ERC721URIStorage{

    // The counter library is used to keep track of tokenIds
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = ['Sigma', 'Omega', 'Chad', 'Gigachad', 'Gorilla'];
    string[] secondWords = ['Vegeta', 'Goku', 'Broly', 'Lee', 'Hokage'];
    string[] thirdWords = ['Grindset', 'Living', 'Push', 'Effort', 'Sweat'];

    event NewEpictNFTMinted(address sender, uint256 tokenId);

    // We need to pass our NFTs token and its symbol
    constructor() ERC721("SquareNFT", "SQUARE"){
        console.log("Hello the constructor just ran!");
    }

    function pickRandomFirstWord(uint256 tokenId) public view returns(string memory) {
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
    rand = rand % secondWords.length;
    return secondWords[rand];
  }

  function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
    rand = rand % thirdWords.length;
    return thirdWords[rand];
  }

    function random(string memory input) internal pure returns(uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    // Function our user will hit to get their NFT
    function makeAnEpicNFT() public {
        // Get the current tokenId, this starts at 0
        uint256 newItemId = _tokenIds.current();

        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(abi.encodePacked(first, second, third));

        string memory finalSvg = string(abi.encodePacked(baseSvg, combinedWord, "</text></svg>"));

        // Get all the JSON metadata in place and base64 encode it
        string memory json = Base64.encode(abi.encodePacked(
            '{"name": "', 
            combinedWord,
            '", "description": "These words will define you!", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(finalSvg)), '"}'
            )
        );

        string memory finalTokenUri = string(abi.encodePacked("data:application/json;base64,", json));

        console.log("\n------------------");
        console.log(finalTokenUri);
        console.log("--------------------\n");

        // Actually mint the NFT to the sender using msg.sender
        _safeMint(msg.sender, newItemId);

        // Set the NFTs data
        _setTokenURI(newItemId, finalTokenUri);
        
        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
        console.log("An NFT with ID %s has been minted to %s", newItemId, msg.sender);

        emit NewEpictNFTMinted(msg.sender, newItemId);
    }
}