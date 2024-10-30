import * as express from 'express';
import { Gateway, Wallets } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';

const server = express();
const portNumber = 3000;

server.use(express.json());

const networkConfigPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
const networkConfig = JSON.parse(fs.readFileSync(networkConfigPath, 'utf8'));

async function initializeWallet() {
    const walletDirectoryPath = path.join(process.cwd(), 'wallet');
    return Wallets.newFileSystemWallet(walletDirectoryPath);
}

async function initializeSmartContract() {
    const gatewayConnection = new Gateway();
    const wallet = await initializeWallet();
    await gatewayConnection.connect(networkConfig, {
        wallet,
        identity: 'himani',
        discovery: { enabled: true, asLocalhost: true }
    });
    const channelNetwork = await gatewayConnection.getNetwork('mychannel');
    const contractInstance = channelNetwork.getContract('smartcontract');
    return contractInstance;
}

server.post('/api/assets', async (req, res) => {
    try {
        const contractInstance = await initializeSmartContract();
        const { assetId, contactNumber, securityPin, assetBalance, assetStatus, transactionAmount, transactionType, description } = req.body;
        await contractInstance.submitTransaction('createAsset', assetId, contactNumber, securityPin, assetBalance.toString(), assetStatus, transactionAmount.toString(), transactionType, description);
        res.status(200).send('Asset successfully created in the ledger.');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

server.get('/api/assets/:assetId', async (req, res) => {
    try {
        const contractInstance = await initializeSmartContract();
        const assetId = req.params.assetId;
        const assetInfo = await contractInstance.evaluateTransaction('queryAsset', assetId);
        res.status(200).json(JSON.parse(assetInfo.toString()));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

server.put('/api/assets/:assetId/balance', async (req, res) => {
    try {
        const contractInstance = await initializeSmartContract();
        const assetId = req.params.assetId;
        const { newBalance } = req.body;
        await contractInstance.submitTransaction('updateAssetValue', assetId, newBalance.toString());
        res.status(200).send('Asset balance successfully updated.');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

server.get('/api/assets/:assetId/history', async (req, res) => {
    try {
        const contractInstance = await initializeSmartContract();
        const assetId = req.params.assetId;
        const historyRecords = await contractInstance.evaluateTransaction('getTransactionHistory', assetId);
        res.status(200).json(JSON.parse(historyRecords.toString()));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

server.listen(portNumber, () => {
    console.log(`Express server is running on port ${portNumber}`);
});
