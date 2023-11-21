import {camelCaseToUnderscore, mock_rpc} from "./test_util";


describe('tx_pool_info', function () {
    it('[]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let state = await RPCClient.txPoolInfo()
        expect(camelCaseToUnderscore(state)).toEqual(responseData["result"]);
    })
})