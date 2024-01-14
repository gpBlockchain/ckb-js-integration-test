import {camelCaseToUnderscore, mock_light_rpc} from "../mock/test_util";

describe("get_peers", function () {

    it("[]", async () => {
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()

        let response = await LightRPCClient.getPeers()
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});