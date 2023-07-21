import {mock_rpc} from "./test_util";

describe('get_fee_rate_statics', function () {

    it('[]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let statistics = await RPCClient.getFeeRateStatics()

        expect(statistics).toEqual(responseData["result"])
    });

    it('[target]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let statistics = await RPCClient.getFeeRateStatics(requestData['params'][0])
        expect(statistics).toEqual(responseData["result"])
    });
    it('null', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let statistics = await RPCClient.getFeeRateStatics()
        expect(statistics).toEqual(responseData["result"])
    });


});