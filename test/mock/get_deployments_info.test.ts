import { mock_rpc} from "./test_util";


describe('get_deployments_info', function () {

    it('[]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let deploymentsInfo = await RPCClient.getDeploymentsInfo()
        expect(deploymentsInfo.deployments.testdummy.threshold).toEqual(responseData["result"]["deployments"]["testdummy"]["threshold"])
    });

});