import {camelCaseToUnderscore, mock_rpc} from "./test_util";

describe('get_transaction_proof', function () {

    it('[tx_hashes,block_hash]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let result = await RPCClient.getTransactionProof(requestData["params"][0], requestData["params"][1])
        expect(camelCaseToUnderscore(result)).toEqual(responseData["result"])
    });

    it('[tx_hashes,null]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let result = await RPCClient.getTransactionProof(requestData["params"][0], requestData["params"][1])
        expect(camelCaseToUnderscore(result)).toEqual(responseData["result"])
    });

    it('[tx_hashes]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let result = await RPCClient.getTransactionProof(requestData["params"][0])
        expect(camelCaseToUnderscore(result)).toEqual(responseData["result"])
    });


});