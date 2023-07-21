import {getRequestCall, setupMockRpcTest} from "./test_util";
import axios from 'axios';

describe('get_block', function () {
    let mockData = setupMockRpcTest();

    it("[block_hash]", async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let block = await RPCClient.getBlock(requestData["params"][0])
        expect(block.header.hash).toEqual(responseData["result"]["header"]["hash"]);
        expect(block.proposals).toEqual(responseData["result"]["proposals"]);
        expect(axios).toBeCalledWith(getRequestCall(requestData))
    })
    it.skip("[block_hash,verbosiby=2,with_cycles=True]", async () => {
    })
    it.skip("[block_hash,verbosity=0]", async () => {
    })
    it.skip("[block_hash,verbosity=2]", async () => {
    })
    it("data2", async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let block = await RPCClient.getBlock(requestData["params"][0])
        expect(block.transactions[1].outputs[0].lock.hashType).toEqual("data2")
        expect(axios).toBeCalledWith(getRequestCall(requestData))
    })
    it.skip('extension', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let block = await RPCClient.getBlock(requestData["params"][0])
        // replace block.extension => block["extension"]
        expect(block["extension"]).toEqual(responseData['result']['extension'])
    });
});