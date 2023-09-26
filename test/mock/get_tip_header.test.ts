import {camelCaseToUnderscore, mock_rpc} from "./test_util";


describe('get_tip_header', function () {
    it('[]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let header = await RPCClient.getTipHeader()
        expect(camelCaseToUnderscore(header)).toEqual(responseData["result"]);
    })

    it.skip('[null]', async () => {
    });

    it.skip("[verbosity=0]", async () => {
    })
    it.skip("[verbosity=1]", async () => {
    })

});

