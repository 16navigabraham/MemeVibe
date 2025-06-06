// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MemeNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => string) public memeImageUrls;
    event MemeMinted(address indexed to, uint256 indexed tokenId, string imageUrl);

    constructor() ERC721("MemeNFT", "MEME") Ownable(msg.sender) {}

    function mintMeme(string memory imageUrl) external {
        uint256 tokenId = ++nextTokenId;
        _safeMint(msg.sender, tokenId);
        memeImageUrls[tokenId] = imageUrl; // Store the image URL in the mapping
        emit MemeMinted(msg.sender, tokenId, imageUrl);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        string memory imageUrl = memeImageUrls[tokenId];
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name":"MemeNFT #', Strings.toString(tokenId),
                        '","description":"Onchain meme NFT",',
                        '"image":"', imageUrl, '"}'
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }
}
