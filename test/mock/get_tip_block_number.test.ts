import axios from 'axios';

import {getRequestCall, setupMockRpcTest} from "./test_util";

describe('get_tip_block_number', function () {
    let mockData = setupMockRpcTest();
    test('[]', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let number = await RPCClient.getTipBlockNumber()
        expect(number).toEqual(responseData["result"]);
        expect(axios).toBeCalledWith(getRequestCall(requestData))
    })

});

