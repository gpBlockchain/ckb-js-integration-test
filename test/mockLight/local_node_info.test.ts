import {camelCaseToUnderscore, mock_light_rpc} from "../mock/test_util";

describe("local_node_info", function () {

    it("[]", async () => {
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()

        let response = await LightRPCClient.localNodeInfo()
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});