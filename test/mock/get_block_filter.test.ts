import {camelCaseToUnderscore, mock_rpc} from "./test_util";


describe("get_block_filter", function () {

    it("[block_hash]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getBlockFilter(requestData["params"][0])
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })

    it("null", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getBlockFilter(requestData["params"][0])
        expect((response)).toEqual(responseData["result"])
    })
});