import {mock_rpc, camelCaseToUnderscore} from "./test_util";


describe("get_block_by_number", function () {

    it.skip("[block_number,verbosity=0,with_cycles]", async () => {

    })
    it("[block_number]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getBlockByNumber(requestData["params"][0])

        console.log(response)
        expect(camelCaseToUnderscore(response)).toEqual(responseData['result'])
    })
    it.skip("[block_number,verbosity=0]", async () => {
    })
    it.skip("[block_number,verbosity=2,with_cycles]", async () => {
    })
    it.skip("[block_number,verbosity=2]", async () => {
    })
})
