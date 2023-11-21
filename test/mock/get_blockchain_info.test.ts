import {camelCaseToUnderscore, mock_rpc} from "./test_util";


describe("get_blockchain_info", function () {

    it("[]",async ()=>{
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getBlockchainInfo()
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});