import {mock_rpc} from "./test_util";


describe("calculate_dao_maximum_withdraw", function () {

    it("[out_point,kind]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.calculateDaoMaximumWithdraw({
            txHash: requestData["params"][0]['tx_hash'], index: requestData["params"][0]['index']
        }, requestData["params"][1])
        expect(response).toEqual(responseData["result"])
    })

    it('DaoError', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()

        try {
            let response = await RPCClient.calculateDaoMaximumWithdraw({
                txHash: requestData["params"][0]['tx_hash'], index: requestData["params"][0]['index']
            }, requestData["params"][1])
        } catch (e) {
            expect(e['message']).toEqual(JSON.stringify(responseData["error"]))
        }
    });
});