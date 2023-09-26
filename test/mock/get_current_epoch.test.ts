import {camelCaseToUnderscore, mock_rpc} from "./test_util";


describe("get_current_epoch", function () {

    it("[]",async ()=>{
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getCurrentEpoch()
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});