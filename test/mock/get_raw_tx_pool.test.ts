import {camelCaseToUnderscore, mock_rpc} from "./test_util";


describe("get_raw_tx_pool", function () {

    it("[]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getRawTxPool()
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
    it("[null]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getRawTxPool(null)
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])

    })

    it("[verbose=false]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getRawTxPool(false)
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
    it("[verbose=true]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getRawTxPool(true)
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })


});