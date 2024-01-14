import {camelCaseToUnderscore, mock_light_rpc} from "../mock/test_util";

describe("fetch_transaction", function () {
    it("fetched", async () => {
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()
        let response = await LightRPCClient.fetchTransaction(requestData["params"][0])
        expect(camelCaseToUnderscore(response['transaction'])).toEqual(responseData["result"]['transaction'])
    })
});