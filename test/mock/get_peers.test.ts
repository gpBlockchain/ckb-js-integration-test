import {camelCaseToUnderscore, mock_rpc} from "./test_util";


describe("get_peers", function () {

    it("[]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getPeers()
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })

});