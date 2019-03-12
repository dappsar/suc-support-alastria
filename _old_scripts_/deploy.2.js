// npm install web3@0.20.0 solc get-json --save
// 
// https://medium.com/coinmonks/executing-and-accessing-smart-contract-without-truffle-415f1e647d66
// https://medium.com/@doart3/ethereum-dapps-without-truffle-compile-deploy-use-it-e6daeefcf919
// https://gist.github.com/tomconte/4edb83cf505f1e7faf172b9252fff9bf
// npm install get-json
// https://gist.github.com/tomconte/4edb83cf505f1e7faf172b9252fff9bf
//
console.log("Requiring web3...");
Web3 = require('web3');

console.log("Requiring solc...");
solc = require('solc');

console.log("Requiring fs...");
fs = require('fs')

console.log("Requiring get-json...");
getJSON = require('get-json')

console.log("Connecting to blockchain...");
web3 = new Web3(new Web3.providers.HttpProvider("http://34.241.169.145:22000"));

account = "0x42339e31a153db90c4f9af3326fc9c541b18225e";

console.log("Unlocking account...");
// web3.eth.personal.unlockAccount
web3.personal.unlockAccount(account, "l@z@r0", 10000);


/*


//console.log(sourceCode);
sourceCode = "contract C { function f() public { } }";

var input = {
	language: 'Solidity',
	sources: {
		'test.sol': {
			content: sourceCode
		}
	},
	settings: {
		outputSelection: {
			'*': {
				'*': [ '*' ]
      },
      "test": {
        "test.sol": [ "abi", "evm.bytecode.opcodes" ]
      },
		}
	}
}
console.log("Compiling the code using Solc...");
//solc 0.4.25: compiledCode = solc.compile(sourceCode, 1);
compiledCode = solc.compile(JSON.stringify(input));

var output = JSON.parse(compiledCode)

// `output` here contains the JSON output as specified in the documentation
for (var contractName in output.contracts['test.sol']) {
	console.log(contractName + ': ' + output.contracts['test.sol'][contractName].evm.bytecode.object)

  console.log("Identifying bytecode...");
  byteCode = output.contracts['test.sol'][contractName].evm.bytecode;

  console.log(byteCode);

  console.log("Identifying contract ABI...");
  contractABI = output.contracts['test.sol'][contractName].evm.bytecode.opcodes;
  
  console.log(contractABI);

  console.log("Deploying contract.."); 
  addContract = web3.eth.contract(contractABI);
  addDeployed = addContract.new({data: byteCode, from: web3.eth.accounts[0], gas: 4700000});
    
}
*/

console.log("Loading contract byteCode...");
byteCode = fs.readFileSync('bytecode.json', {
  encoding: 'utf8'
}).toString();

console.log("Loading contract ABI...");
//contractABI = fs.readFileSync('abi.json',{encoding: 'utf8'}).toString();

/*

getJSON('http://api.listenparadise.org', function(error, response){
 
    console.log(error);
    // undefined
 
    console.log(response);
    // ["Beth Orton &mdash; Stolen Car",
    // "Jack White &mdash; Temporary Ground",
    // "I Am Kloot &mdash; Loch",
    // "Portishead &mdash; Glory Box"]
});

*/

contractABI = "";
myContract = "";

console.log("Getting Contract ABI...");

getJSON('http://api.etherscan.io/api?module=contract&action=getabi&address=0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359', function (error, response) {
  console.log(response);

  contractABI = JSON.parse(response.result);
  if (contractABI != '') {

    console.log("Adding Contract...");
    myContract = web3.eth.contract(contractABI);
    //bytecode, arguments:['Joseph','Sean','Matthew']

    console.log("deploying...");
  
    addDeployed = myContract.new({
        data: byteCode,
        from: account,
        gas: 10000000
      },
      function (error, response) {
        if (error) {
          console.log(error);
          return;
        }

        // Log the tx, you can explore statu
        console.log("transaction...");
        console.log(response);

        // If we have an address property, the contract was deployed
        if (response.address) {
          //console.log("Contract address: " + res.address);
          // Let's test the deployed contract
          testContract(response.address);
        }
      });


    //console.log("Testing contract at...")
    //console.log(myContract.at(addDeployed.address));

    //var myContractInstance = MyContract.at("0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359");
    //var result = myContractInstance.memberId("0xfe8ad7dd2f564a877cc23feea6c0a9cc2e783715");
    //console.log("result1 : " + result);            
    //var result = myContractInstance.members(1);
    //console.log("result2 : " + result);
  } else {
    console.log("Error");
  }
});

function testContract(address) {
  // Reference to the deployed contract
  const token = myContract.at(address);

  console.log("\ntoken: " + token);

  /*
  // Destination account for test
  const dest_account = '0x002D61B362ead60A632c0e6B43fCff4A7a259285';

  // Assert initial account balance, should be 100000
  const balance1 = token.balances.call(web3.eth.coinbase);
  console.log(balance1 == 1000000);

  // Call the transfer function
  token.transfer(dest_account, 100, {from: web3.eth.coinbase}, (err, res) => {
      // Log transaction, in case you want to explore
      console.log('tx: ' + res);
      // Assert destination account balance, should be 100 
      const balance2 = token.balances.call(dest_account);
      console.log(balance2 == 100);
  });
  */
}


//addContract = web3.eth.Contract(byteCode, contractABI, {from: "0x42339e31a153db90c4f9af3326fc9c541b18225e"});
//addContract = web3.eth.Contract(contractABI);

//console.log("Adding Contract...");


//console.log(compiledCode);

// Create an instance to use the contract
//app = addContract.at(addDeployed.address);

// test
//console.log(app.Sum(4, 8, {from: web3.eth.accounts[0]}));

//console.log(web3.eth.accounts);