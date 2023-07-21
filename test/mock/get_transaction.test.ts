import {getRequestCall, setupMockRpcTest} from "./test_util";
import axios from 'axios';

describe('get_transaction', function () {
    let mockData = setupMockRpcTest();

    it('[tx_hash,verbosity=0]', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let tx = await RPCClient.getTransaction(requestData["params"][0], requestData["params"][1])
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(tx.transaction).toEqual(responseData["result"]["transaction"])
    });

    it('[tx_hash,verbosity,only_committed=null]', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let tx = await RPCClient.getTransaction(requestData["params"][0], requestData["params"][1], requestData["params"][2])
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(tx.txStatus.blockHash).toEqual(responseData["result"]["tx_status"]["block_hash"])
    });

    it('[tx_hash,verbosity=null,only_committed=true]', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let tx = await RPCClient.getTransaction(requestData["params"][0], requestData["params"][1], requestData["params"][2])
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(tx.txStatus.blockHash).toEqual(responseData["result"]["tx_status"]["block_hash"])

    })

    it("time_added_to_pool", async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let tx = await RPCClient.getTransaction(requestData["params"][0], requestData["params"][1], requestData["params"][2])
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(tx.timeAddedToPool).toEqual(responseData["result"]["time_added_to_pool"])
        expect(tx.cycles).toEqual(responseData["result"]["cycles"])
    })

    it("data2", async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let tx = await RPCClient.getTransaction(requestData["params"][0], requestData["params"][1], requestData["params"][2])
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(tx.transaction.outputs[0].lock.hashType).toEqual("data2")
        expect(tx.cycles).toEqual(responseData["result"]["cycles"])
    })

    it("rejected", async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let tx = await RPCClient.getTransaction(requestData["params"][0], requestData["params"][1], requestData["params"][2])
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(tx.txStatus.status).toEqual("rejected")
        expect(tx.txStatus["reason"]).toEqual(responseData["result"]["tx_status"]["reason"])

    })
});