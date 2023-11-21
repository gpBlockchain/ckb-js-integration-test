

import {toTransaction} from "@ckb-lumos/rpc/lib/resultFormatter";
import {mock_rpc} from "./test_util";


describe("estimate_cycles", function () {

    it("[tx]",async ()=>{
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let tx = toTransaction(requestData["params"][0])
        // @ts-ignore
        let response = await RPCClient.estimateCycles(tx)
        expect(response.cycles).toEqual(responseData["result"]["cycles"])
    })
});