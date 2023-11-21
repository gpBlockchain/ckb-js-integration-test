import {camelCaseToUnderscore, mock_rpc} from "./test_util";


describe("get_block_economic_state", function () {

    it("[block_hash]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getBlockEconomicState(requestData["params"][0])
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});