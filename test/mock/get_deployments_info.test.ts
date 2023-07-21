import {getRequestCall, setupMockRpcTest} from "./test_util";
import axios from 'axios';

describe('get_deployments_info', function () {
    let mockData = setupMockRpcTest();

    it('[]', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let deploymentsInfo = await RPCClient.getDeploymentsInfo()
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(deploymentsInfo.deployments.testdummy.threshold).toEqual(responseData["result"]["deployments"]["testdummy"]["threshold"])
    });

});