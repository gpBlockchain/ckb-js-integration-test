import {getRequestCall, setupMockRpcTest} from "./test_util";
import axios from 'axios';
describe('get_consensus', function () {
    let mockData = setupMockRpcTest();

    it.skip('[]', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let consensus = await RPCClient.getConsensus()
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        // TODO add check hardforkFeatures
        // TODO add check threshold
    });

});