import { mock_light_rpc} from "../mock/test_util";
import {toTransaction} from "@ckb-lumos/rpc/lib/resultFormatter";

describe("send_transaction", function () {

    it("[tx]", async () => {
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()
        let tx = toTransaction(requestData["params"][0])
        let txHash = await LightRPCClient.sendTransaction(tx)
        expect(txHash).toEqual(responseData["result"])
    })
});