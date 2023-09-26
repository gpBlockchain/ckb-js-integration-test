import {camelCaseToUnderscore, mock_rpc} from "./test_util";


describe("get_epoch_by_number", function () {

    it("[epoch_number]",async ()=>{
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getEpochByNumber(requestData["params"][0])
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});