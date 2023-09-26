import {mock_rpc} from "./test_util";


describe("clear_tx_pool", function () {

    it("[]",async ()=>{
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.clearTxPool()
        expect(response).toEqual(responseData["result"])
    })
});