import {mock_rpc} from "./test_util";


describe("clear_banned_addresses", function () {

    it("[]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.clearBannedAddresses()
        expect(response).toEqual(responseData["result"])
    })
});