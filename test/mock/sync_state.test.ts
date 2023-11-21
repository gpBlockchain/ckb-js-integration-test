import {camelCaseToUnderscore, mock_rpc} from "./test_util";


describe('sync_state', function () {
    it('[]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let state = await RPCClient.syncState()
        expect(camelCaseToUnderscore(state)).toEqual(responseData["result"]);
    })
})