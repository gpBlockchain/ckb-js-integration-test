import { mock_rpc} from "./test_util";


describe('set_network_active', function () {
    it('[state]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let ban = await RPCClient.setNetworkActive(
            requestData['params'][0]
        )
        expect(ban).toEqual(responseData["result"]);
    })
})