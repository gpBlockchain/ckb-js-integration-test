import {camelCaseToUnderscore, mock_rpc} from "./test_util";

describe('get_header_by_number', function () {

    it('[block_number]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getHeaderByNumber(requestData["params"][0])
        expect(camelCaseToUnderscore(block)).toEqual(responseData['result'])
    });
    it("[block_number,null]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getHeaderByNumber(requestData["params"][0],requestData["params"][1])
        expect(camelCaseToUnderscore(block)).toEqual(responseData['result'])
    })
    it("[block_number,verbosity=0]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getHeaderByNumber(requestData["params"][0],"0x0")
        expect((block)).toEqual(responseData['result'])
    })
    it("[block_number,verbosity=1]",async ()=>{
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getHeaderByNumber(requestData["params"][0],"0x1")
        expect(camelCaseToUnderscore(block)).toEqual(responseData['result'])

    })
});