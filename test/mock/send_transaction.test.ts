import {toTransaction} from "@ckb-lumos/rpc/lib/resultFormatter";
import {mock_rpc} from "./test_util";


describe('send_transaction', function () {

    it('data2', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let tx = toTransaction(requestData["params"][0])
        let txHash = await RPCClient.sendTransaction(tx, requestData["params"][1])

        expect(txHash).toEqual(responseData["result"])
    });
    it('TransactionFailedToResolve', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let tx = toTransaction(requestData["params"][0])
        try {
            await RPCClient.sendTransaction(tx, requestData["params"][1])
        } catch (e) {
            expect(e['message']).toEqual(JSON.stringify(responseData["error"]))
        }


    })

});