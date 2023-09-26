import {mock_rpc} from "./test_util";
import {toBannedAddress} from "@ckb-lumos/rpc/lib/resultFormatter";


describe("get_banned_addresses", function () {

    it("[]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getBannedAddresses()
        expect(response).toEqual(responseData["result"].map(address => toBannedAddress(address)))
        for (let i = 0; i < responseData["result"].length; i++) {
            expect(responseData["result"][i]['address']).toEqual(response[i].address)
            expect(responseData["result"][i]['ban_reason']).toEqual(response[i].banReason)
            expect(responseData["result"][i]['ban_until']).toEqual(response[i].banUntil)
            expect(responseData["result"][i]['created_at']).toEqual(response[i].createdAt)
        }
    })
});