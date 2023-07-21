import {getRequestCall, setupMockRpcTest} from "./test_util";
import axios from 'axios';
import {toTransaction} from "@ckb-lumos/rpc/lib/resultFormatter";


describe('send_transaction', function () {
    let mockData = setupMockRpcTest();

    it('data2', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let tx = toTransaction(requestData["params"][0])
        let txHash = await RPCClient.sendTransaction(tx, requestData["params"][1])
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(txHash).toEqual(responseData["result"])
    });
    it('TransactionFailedToResolve', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let tx = toTransaction(requestData["params"][0])
        try {
            await RPCClient.sendTransaction(tx, requestData["params"][1])
        } catch (e) {
            expect(axios).toBeCalledWith(getRequestCall(requestData))
            expect(e['message']).toEqual(JSON.stringify(responseData["error"]))
        }


    })

});