import { mock_rpc} from "./test_util";


describe('remove_node', function () {
    it('[peer_id]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let peers = await RPCClient.removeNode(requestData['params'][0])
        expect(peers).toEqual(responseData["result"]);
    })
})