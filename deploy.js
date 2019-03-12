// Requisitos: npm install web3@0.20.0 solc get-json --save
// Urls info:
  // https://medium.com/coinmonks/executing-and-accessing-smart-contract-without-truffle-415f1e647d66
  // https://medium.com/@doart3/ethereum-dapps-without-truffle-compile-deploy-use-it-e6daeefcf919
  // https://gist.github.com/tomconte/4edb83cf505f1e7faf172b9252fff9bf
  // APi info: https://rinkeby.etherscan.io/apis#contracts
//

// Alastria blockchain
var blockchainAddress = process.env.blockchainAddress || "http://34.241.169.145:22000";

// Alastria Account
var account = process.env.account ||  "0x42339e31a153db90c4f9af3326fc9c541b18225e";

// contract and address must be verified with code!!
var contractAddress = process.env.contractAddress ||  "0x3df5b00ee906f6ccb7fa9d43fb12b923d0ec69d1";

// Alastria account password
var accountPswd = process.env.accountPswd || '';

console.log("\nRequiring web3@0.20.0...");
Web3 = require('web3');

console.log("\nRequiring solc...");
solc = require('solc');

console.log("\nRequiring fs...");
fs = require('fs')

console.log("\nRequiring get-json...");
getJSON = require('get-json')

web3 = null;

function main() {
  console.log("\nConnecting to blockchain " + blockchainAddress + "...");
  web3 = new Web3(new Web3.providers.HttpProvider(blockchainAddress));

  console.log("\nUnlocking account " + account + "...");
  web3.personal.unlockAccount(account, accountPswd, 10000);

  console.log("\nLoading contract byteCode from bytecode.json...");
  byteCode = getByteCode();


  console.log("\nGetting Contract ABI from address " + contractAddress + "...");
  url = "https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=" + contractAddress;

  getJSON(url, function (error, response) {

    console.log(response);
    contractABI = JSON.parse(response.result);
    if (contractABI != '') {

      console.log("\nAdding Contract...");
      myContract = web3.eth.contract(contractABI);
      
      console.log("\ndeploying...");
      deployContract (myContract, byteCode);
      
    } else {
      console.error("\nError getting ABI");
    }
  });
}

function deployContract(contract, byteCode) {
  addDeployed = myContract.new({
      data: byteCode,
      arguments: ['sucTokenTest1', 'suc'],
      from: account,
      gas: 10000000
    },
    function (error, response) {
      if (error) {
        console.log(error);
        return;
      } else {
        // Log the tx, you can explore status
        console.log("\ntransaction...");
        console.log(response);

        // If we have an address property, the contract was deployed
        if (response.address) {
          console.log("\nContract deployed! - address: " + response.address);
          // Let's test the deployed contract
          testContract(response.address);
        }         
      }
  });
}


function getByteCode() {
  var byteCode = fs.readFileSync('bytecode.json', {
    encoding: 'utf8'
  }).toString();

  return '0x' + byteCode;
}


function testContract(address) {

  console.log ("Testing contract...");

  // Reference to the deployed contract
  const mToken = myContract.at(address);

  console.log("Contract support Interface ERC721: " + mToken.supportsInterface('0x80ac58cd')); 
  console.log("Contract support Interface ERC721Metadata: " + mToken.supportsInterface('0x5b5e139f')); 
  console.log("Contract support Interface ERC721Enumerable: " + mToken.supportsInterface('0x780e9d63')); 
  console.log("Contract support Interface ERC165: " + mToken.supportsInterface('0x01ffc9a7')); 

  // console.log(mToken.mint(account, "2"));
  // console.log(mToken.balanceOf(account)); // 1
  //console.log(mToken.totalSupply()); // 1
  // console.log("Returns the correct issuer name (sucTokenTest1): " + (mToken.name().toString() == "sucTokenTest1"));
  // console.log("Returns the correct issuer symbol (suc): " + (mToken.symbol().toString() == "suc"));

}


// entry point
main();

