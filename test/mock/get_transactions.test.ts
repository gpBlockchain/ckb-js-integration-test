import {camelCaseToUnderscore, mock_rpc} from "./test_util";
import {toSearchKey} from "@ckb-lumos/ckb-indexer/lib/resultFormatter";

describe('get_transactions', function () {

    it('[search_key,order,limit]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let result = await RPCClient.getTransactions(
            toSearchKey(requestData["params"][0]), requestData["params"][1], requestData["params"][2])
        expect(camelCaseToUnderscore(result)).toEqual(responseData["result"])
    });
    it("[search_key,order,limit,null]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let result = await RPCClient.getTransactions(
            toSearchKey(requestData["params"][0]), requestData["params"][1], requestData["params"][2],null)
        expect(camelCaseToUnderscore(result)).toEqual(responseData["result"])

    })
    it("[search_key,order,limit,after]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let result = await RPCClient.getTransactions(
            toSearchKey(requestData["params"][0]), requestData["params"][1],
            requestData["params"][2],requestData["params"][3])
        expect(camelCaseToUnderscore(result)).toEqual(responseData["result"])

    })

})