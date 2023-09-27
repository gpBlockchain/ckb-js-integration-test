import {mock_rpc, camelCaseToUnderscore} from "./test_util";


describe("get_block_by_number", function () {

    it("[block_number,verbosity=0,with_cycles]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getBlockByNumber(requestData["params"][0],"0x0",requestData["params"][2])
        expect((response)).toEqual(responseData['result'])

    })
    it("[block_number]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getBlockByNumber(requestData["params"][0])

        expect(camelCaseToUnderscore(response)).toEqual(responseData['result'])
    })
    it("[block_number,verbosity=0]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getBlockByNumber(requestData["params"][0],"0x0")
        expect((response)).toEqual(responseData['result'])

    })
    it("[block_number,verbosity=2,with_cycles]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getBlockByNumber(requestData["params"][0],"0x2",requestData["params"][2])
        expect(camelCaseToUnderscore(response.header)).toEqual(responseData['result']['header'])
    })
    it("[block_number,verbosity=2]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getBlockByNumber(requestData["params"][0],"0x2")
        expect(camelCaseToUnderscore(response.header)).toEqual(responseData['result']['header'])

    })
})
