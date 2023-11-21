import {mock_rpc} from "./test_util";


describe("add_node", function () {

    it("[peer_id,address]",async ()=>{
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.addNode(requestData["params"][0],requestData["params"][1])
        expect(response).toEqual(responseData["result"])
    })
});