import {camelCaseToUnderscore, mock_rpc} from "./test_util";

describe('get_block', function () {

    it("[block_hash]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getBlock(requestData['params'][0])
        expect(block.header.hash).toEqual(responseData["result"]["header"]["hash"]);
        expect(block.proposals).toEqual(responseData["result"]["proposals"]);
    })
    it("[block_hash,verbosiby=2,with_cycles=True]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getBlock(requestData['params'][0],"0x2",true)
        expect((block.cycles)).toEqual(responseData["result"]['cycles']);
    })

    it("[block_hash,verbosity=0]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getBlock(requestData['params'][0],"0x0")
        expect((block)).toEqual(responseData["result"]);
    })
    it("[block_hash,verbosity=2]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getBlock(requestData['params'][0],"0x2")
        expect(camelCaseToUnderscore(block)).toEqual(responseData["result"]);
    })
    it("data2", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getBlock(requestData["params"][0])
        expect(block.transactions[1].outputs[0].lock.hashType).toEqual("data2")
    })
    it('extension', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getBlock(requestData["params"][0],requestData['params'][1])
        expect(block.extension).toEqual(responseData['result']['extension'])
    });
});