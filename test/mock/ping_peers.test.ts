import {camelCaseToUnderscore, mock_rpc} from "./test_util";


describe('ping_peers', function () {
    it('[]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let peers = await RPCClient.pingPeers()
        expect(peers).toEqual(responseData["result"]);
    })
})