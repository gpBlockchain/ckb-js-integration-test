import {camelCaseToUnderscore, mock_rpc} from "./test_util";

describe('get_header', function () {

    it('[block_hash,verbosity=0]', async () => {
        let {RPCClient, requestData, responseData} =await mock_rpc()
        let block = await RPCClient.getHeader(requestData["params"][0],"0x0")
        expect(block).toEqual(responseData['result'])
    });

    it('[block_hash,verbosity=1]', async () => {
        let {RPCClient, requestData, responseData} =await mock_rpc()
        let block  = await RPCClient.getHeader(requestData["params"][0],"0x1")
        expect(camelCaseToUnderscore(block)).toEqual(responseData['result'])
    })

    it('[block_hash]', async () => {
        let {RPCClient, requestData, responseData} =await mock_rpc()
        let block = await RPCClient.getHeader(requestData["params"][0])
        expect(block.extraHash).toEqual(responseData['result']['extra_hash'])
    });
});