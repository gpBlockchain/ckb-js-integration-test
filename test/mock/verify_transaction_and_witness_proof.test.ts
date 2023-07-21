import {toTransactionAndWitnessProof} from "@ckb-lumos/rpc/lib/resultFormatter";
import {mock_rpc} from "./test_util";

describe('verify_transaction_and_witness_proof', function () {


    test('[tx_proof]', async () => {
        let {RPCClient, requestData, responseData} =await mock_rpc()
        let strs = await RPCClient.verifyTransactionAndWitnessProof(toTransactionAndWitnessProof(requestData["params"][0]))
        expect(strs).toEqual(responseData["result"]);
    })

});