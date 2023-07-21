
import {getRequestCall, setupMockRpcTest} from "./test_util";
import axios from 'axios';
import {RPC} from "@ckb-lumos/rpc/lib/types/rpc";
import {toTransaction} from "@ckb-lumos/rpc/lib/resultFormatter";

describe("estimate_cycles", function () {
    let mockData = setupMockRpcTest();

    it("[tx]",async ()=>{
        let {RPCClient, requestData, responseData} = mockData()
        let tx = toTransaction(requestData["params"][0] as RPC.Transaction)
        // @ts-ignore
        let response = await RPCClient.estimateCycles(tx)
        RPCClient.sendTransaction
        expect(axios).toBeCalledWith(getRequestCall(requestData))
        expect(response.cycles).toEqual(responseData["result"]["cycles"])
    })

});