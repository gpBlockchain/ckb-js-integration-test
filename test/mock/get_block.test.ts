import {mock_rpc} from "./test_util";

describe('get_block', function () {

    it("[block_hash]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getBlock(requestData['params'][0])
        expect(block.header.hash).toEqual(responseData["result"]["header"]["hash"]);
        expect(block.proposals).toEqual(responseData["result"]["proposals"]);
    })
    it.skip("[block_hash,verbosiby=2,with_cycles=True]", async () => {
    })
    it.skip("[block_hash,verbosity=0]", async () => {
    })
    it.skip("[block_hash,verbosity=2]", async () => {
    })
    it("data2", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getBlock(requestData["params"][0])
        expect(block.transactions[1].outputs[0].lock.hashType).toEqual("data2")
    })
    it.skip('extension', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getBlock(requestData["params"][0])
        // replace block.extension => block["extension"]
        expect(block["extension"]).toEqual(responseData['result']['extension'])
    });
});