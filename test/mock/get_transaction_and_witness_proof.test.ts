import {getRequestCall, setupMockRpcTest} from "./test_util";
import axios from 'axios';

describe('get_transaction_and_witness_proof', function () {
    let mockData = setupMockRpcTest();

    it('[hashs]', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let result = await RPCClient.getTransactionAndWitnessProof(requestData["params"][0])
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(result.blockHash).toEqual(responseData["result"]["block_hash"])
        expect(result.transactionsProof).toEqual(responseData["result"]["transactions_proof"])
        expect(result.witnessesProof).toEqual(responseData["result"]["witnesses_proof"])

    });

    it('[tx_hashs,block_hash]', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let result = await RPCClient.getTransactionAndWitnessProof(requestData["params"][0], requestData["params"][1])
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(result.blockHash).toEqual(responseData["result"]["block_hash"])
        expect(result.transactionsProof).toEqual(responseData["result"]["transactions_proof"])
        expect(result.witnessesProof).toEqual(responseData["result"]["witnesses_proof"])

    });


});