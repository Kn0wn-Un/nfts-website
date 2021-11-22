// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import {Base64} from "./libraries/Base64.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract MyEpicNFT is ERC721URIStorage {
    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;
    event NewEpicNFTMinted(address sender, uint256 tokenId);

    Counters.Counter private _tokenIds;
    mapping(address => uint256) public userToNft;

    string baseSvg =
        "<svg width='300' height='250' xmlns='http://www.w3.org/2000/svg' version='1.0' style='background-color:#000'><defs><linearGradient id='c' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#f0f' stop-opacity='.996' offset='0'/><stop stop-color='#00f' stop-opacity='.996' offset='1'/></linearGradient><linearGradient id='a' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#f0f' offset='0'/><stop stop-color='#00f' stop-opacity='.996' offset='1'/><stop offset='1' stop-opacity='.988'/><stop stop-color='0' stop-opacity='0' offset='NaN'/><stop stop-color='0' stop-opacity='0' offset='NaN'/></linearGradient><filter id='b' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur in='SourceGraphic' stdDeviation='10'/></filter></defs><path fill='url(#a)' filter='url(#b)' d='M150 244c-69.06 0-125-55.94-125-125S80.94-6 150-6s125 55.94 125 125-55.94 125-125 125z' opacity='.35'/><path fill='url(#c)' opacity='undefined' d='M150 214c-49.724 0-90-40.276-90-90s40.276-90 90-90 90 40.276 90 90-40.276 90-90 90z'/><path fill='none' stroke='#000' d='M0 150h300M0 160h300M0 170h300M0 180h300M0 190h300M0 200h300M0 210h300'/><text fill='#fff' stroke='#000' stroke-width='0' x='235' y='250' font-size='18' font-family='Caveat' xml:space='preserve'>";

    // We need to pass the name of our NFTs token and it's symbol.
    constructor() ERC721("NeonSunNFT", "NEONSUN") {
        console.log("This is my NFT contract. Woah!");
        _tokenIds.increment();
    }

    // A function our user will hit to get their NFT.
    function makeAnEpicNFT() public {
        // Get the current tokenId, this starts at 0.
        uint256 newItemId = _tokenIds.current();

        require(newItemId <= 50, "NFT Limit Reached");
        require(userToNft[msg.sender] == 0, "User already owns NFT");

        // Actually mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newItemId);

        string memory finalSvg = string(
            abi.encodePacked(
                baseSvg,
                Strings.toString(_tokenIds.current()),
                "/50",
                "</text></svg>"
            )
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Neon-Sun #',
                        // We set the title of our NFT as the generated word.
                        Strings.toString(_tokenIds.current()),
                        '", "description": "Collection of neon suns.", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        // Set the NFTs data.
        _setTokenURI(newItemId, finalTokenUri);

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );

        userToNft[msg.sender] = newItemId;

        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();

        emit NewEpicNFTMinted(msg.sender, newItemId);
    }

    function totalSupply() public view returns (uint256 _totalnfts) {
        return _tokenIds.current() - 1;
    }

    function getUserNft() public view returns (uint256 _nftId) {
        return userToNft[msg.sender];
    }
}
