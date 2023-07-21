import {getRequestCall, setupMockRpcTest} from "./test_util";
import axios from 'axios';

describe('get_header', function () {
    let mockData = setupMockRpcTest();

    it.skip('[block_hash,verbosity=0]', async () => {

    });

    it.skip('[block_hash,verbosity=1]', async () => {
    })

    it('[block_hash]', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let block = await RPCClient.getHeader(requestData["params"][0])
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(block.extraHash).toEqual(responseData['result']['extra_hash'])
    });
});