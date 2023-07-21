import {mock_rpc} from "./test_util";

describe('get_fee_rate_statistics', function () {

    it('[]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let statistics = await RPCClient.getFeeRateStatistics()
        expect(statistics).toEqual(responseData["result"])
    });

    it.skip('[target]', async () => {
        // let {RPCClient, requestData, responseData} = await mock_rpc()
        // let statistics = await RPCClient.getFeeRateStatistics(requestData['params'][0])
        // expect(axios).toBeCalledWith(getRequestCall(requestData))
        // expect(statistics).toEqual(responseData["result"])
    });
    it('null', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let statistics = await RPCClient.getFeeRateStatistics()
        expect(statistics).toEqual(responseData["result"])
    });

});