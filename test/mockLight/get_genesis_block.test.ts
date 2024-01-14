import {camelCaseToUnderscore, mock_light_rpc} from "../mock/test_util";

describe("get_genesis_block", function () {

    it("[]", async () => {
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()

        let response = await LightRPCClient.getGenesisBlock()
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});