import {camelCaseToUnderscore, mock_rpc} from "./test_util";


describe('local_node_info', function () {
    it('[]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let header = await RPCClient.localNodeInfo()
        expect(camelCaseToUnderscore(header)).toEqual(responseData["result"]);
    })
})