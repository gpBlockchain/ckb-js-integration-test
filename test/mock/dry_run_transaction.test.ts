import {mock_rpc} from "./test_util";
import {toTransaction} from "@ckb-lumos/rpc/lib/resultFormatter";


describe("dry_run_transaction", function () {

    it("[tx]",async ()=>{
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.dryRunTransaction(toTransaction(requestData["params"][0]))
        expect(response).toEqual(responseData["result"])
    })
});