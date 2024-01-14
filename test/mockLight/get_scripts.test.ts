import {camelCaseToUnderscore, mock_light_rpc} from "../mock/test_util";

describe("get_scripts", function () {

    it("[]", async () => {
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()

        let response = await LightRPCClient.getScripts()
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});