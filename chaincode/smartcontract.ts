import { Context, Contract } from 'fabric-contract-api';

export class DealerAssetContract extends Contract {

    async register(
        ctx: Context, 
        assetId: string, 
        contactNumber: string, 
        securityPin: string, 
        startingBalance: number, 
        status: string, 
        transactionAmount: number, 
        transactionType: string, 
        comments: string
    ): Promise<void> {
        const assetData = {
            assetId,
            contactNumber,
            securityPin,
            startingBalance,
            status,
            transactionAmount,
            transactionType,
            comments
        };
        
        const assetBuffer = Buffer.from(JSON.stringify(assetData));
        await ctx.stub.putState(assetId, assetBuffer);
    }

    async modify(
        ctx: Context, 
        assetId: string, 
        newBalance: number
    ): Promise<void> {
        const existingData = await ctx.stub.getState(assetId);

        if (!existingData || existingData.length === 0) {
            throw new Error(`Asset with ID ${assetId} does not exist.`);
        }

        const assetData = JSON.parse(existingData.toString());
        assetData.startingBalance = newBalance;

        const updatedDataBuffer = Buffer.from(JSON.stringify(assetData));
        await ctx.stub.putState(assetId, updatedDataBuffer);
    }

    async retrieve(
        ctx: Context, 
        assetId: string
    ): Promise<string> {
        const assetBytes = await ctx.stub.getState(assetId);

        if (!assetBytes || assetBytes.length === 0) {
            throw new Error(`Asset with ID ${assetId} does not exist.`);
        }

        return assetBytes.toString();
    }

    async fetch(
        ctx: Context, 
        assetId: string
    ): Promise<string[]> {
        const historyIterator = await ctx.stub.getHistoryForKey(assetId);
        const historyRecords = [];

        for await (const record of historyIterator) {
            historyRecords.push(record.value.toString('utf8'));
        }

        return historyRecords;
    }
}
