import {camelCaseToUnderscore, mock_light_rpc} from "../mock/test_util";

describe("get_header", function () {

    it("[block_hash]", async () => {
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()

        let response = await LightRPCClient.getHeader(
            requestData["params"][0]
        )
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});