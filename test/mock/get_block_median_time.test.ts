import {mock_rpc} from "./test_util";


describe("get_block_median_time", function () {

    it("[block_hash]",async ()=>{
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getBlockMedianTime(requestData["params"][0])
        expect(response).toEqual(responseData["result"])
    })
});