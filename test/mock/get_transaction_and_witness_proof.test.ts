import {mock_rpc} from "./test_util";

describe('get_transaction_and_witness_proof', function () {

    it('[hashs]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let result = await RPCClient.getTransactionAndWitnessProof(requestData["params"][0])

        expect(result.blockHash).toEqual(responseData["result"]["block_hash"])
        expect(result.transactionsProof).toEqual(responseData["result"]["transactions_proof"])
        expect(result.witnessesProof).toEqual(responseData["result"]["witnesses_proof"])

    });

    it('[tx_hashs,block_hash]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let result = await RPCClient.getTransactionAndWitnessProof(requestData["params"][0], requestData["params"][1])

        expect(result.blockHash).toEqual(responseData["result"]["block_hash"])
        expect(result.transactionsProof).toEqual(responseData["result"]["transactions_proof"])
        expect(result.witnessesProof).toEqual(responseData["result"]["witnesses_proof"])

    });


});