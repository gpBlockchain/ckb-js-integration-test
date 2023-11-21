import {camelCaseToUnderscore, mock_rpc} from "./test_util";
import {toTransactionProof} from "@ckb-lumos/rpc/lib/resultFormatter";


describe('verify_transaction_proof', function () {
    it('[tx_proof]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let state = await RPCClient.verifyTransactionProof(toTransactionProof(requestData['params'][0]))
        expect(camelCaseToUnderscore(state)).toEqual(responseData["result"]);
    })
})