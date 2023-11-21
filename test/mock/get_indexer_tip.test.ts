import {camelCaseToUnderscore, mock_rpc} from "./test_util";


describe("get_indexer_tip", function () {

    it("[]",async ()=>{
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getIndexerTip()
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});