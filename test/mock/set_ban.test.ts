import { mock_rpc} from "./test_util";


describe('set_ban', function () {
    it('[address,command,ban_time,absolute,reason]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let ban = await RPCClient.setBan(
            requestData['params'][0],
            requestData['params'][1],
            requestData['params'][2],
            requestData['params'][3],
            requestData['params'][4],
        )
        expect(ban).toEqual(responseData["result"]);
    })
})