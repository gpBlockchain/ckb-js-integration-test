import {getRequestCall, setupMockRpcTest} from "./test_util";
import axios from 'axios';
import {toTransactionAndWitnessProof} from "@ckb-lumos/rpc/lib/resultFormatter";

describe('verify_transaction_and_witness_proof', function () {

    let mockData = setupMockRpcTest();
    test('[tx_proof]', async () => {
        let {RPCClient, requestData, responseData} = mockData()
        let strs = await RPCClient.verifyTransactionAndWitnessProof(toTransactionAndWitnessProof(requestData["params"][0]))
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(strs).toEqual(responseData["result"]);
    })

});