import {getRequestCall, setupMockRpcTest} from "./test_util";
import axios from 'axios';

describe('get_fee_rate_statics', function () {
    let mockData = setupMockRpcTest();

    it('[]', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let statistics = await RPCClient.getFeeRateStatics()
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(statistics).toEqual(responseData["result"])
    });

    it('[target]', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let statistics = await RPCClient.getFeeRateStatics(requestData['params'][0])
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(statistics).toEqual(responseData["result"])
    });
    it('null', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let statistics = await RPCClient.getFeeRateStatics()
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(statistics).toEqual(responseData["result"])
    });



});