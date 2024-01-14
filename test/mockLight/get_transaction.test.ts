import {camelCaseToUnderscore, mock_light_rpc} from "../mock/test_util";

describe("get_transaction", function () {

    it("[transaction_hash]", async () => {
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()
        let response = await LightRPCClient.getTransaction(requestData["params"][0])
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});