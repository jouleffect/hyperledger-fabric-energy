'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../../../test-application/javascript/CAUtil.js');
const { buildCCPOrg2, buildWallet } = require('../../../../test-application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'mychain';
const mspOrg2 = 'Org2MSP';
const walletPath = path.join(__dirname, 'wallet');
const org2UserId = 'appUser';

const Power = require('/var/www/html/js/power.js');

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg2();

		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org2.example.com');

		const wallet = await buildWallet(Wallets, walletPath);

		await enrollAdmin(caClient, wallet, mspOrg2);
		
		await registerAndEnrollUser(caClient, wallet, mspOrg2, org2UserId, 'org2.department1');

		const gateway = new Gateway();

		try {			
			await gateway.connect(ccp, {
				wallet,
				identity: org2UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			
			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);
			
			console.log('\n--> Submit Transaction: InitLedger, inizializza il set di assets');
			await contract.submitTransaction('InitLedger');
			console.log('*** Result: committed');

			console.log('\n--> Evaluate Transaction: GetAllAssets, stampa la lista degli assets');
			let result = await contract.evaluateTransaction('GetAllAssets');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			console.log('\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist');
			result = await contract.evaluateTransaction('AssetExists', 'asset1');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			console.log('\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350');
			let newpower = Power.getPower();
			console.log(newpower);
			await contract.submitTransaction('UpdateAsset', 'asset1', 'Giulia', parseInt(newpower));
			console.log('*** Result: committed');

			console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
			result = await contract.evaluateTransaction('ReadAsset', 'asset1');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			//console.log('\n--> Evaluate Transaction: Eroga, function returns "asset1" attributes');
			//result = await contract.submitTransaction('Eroga', '00001', '07/07/2021', '300');
			//console.log(`*** Result: ${prettyJSONString(result.toString())}`);

		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

main();
