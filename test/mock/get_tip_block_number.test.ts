import {mock_rpc} from "./test_util";


describe('get_tip_block_number', function () {
    test('[]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let number = await RPCClient.getTipBlockNumber()
        expect(number).toEqual(responseData["result"]);
    })

});

