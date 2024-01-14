import {camelCaseToUnderscore, mock_light_rpc} from "../mock/test_util";

describe("fetch_header", function () {

    it("fetched",async ()=>{
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()
        let response = await LightRPCClient.fetchHeader(requestData["params"][0])
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});