import {camelCaseToUnderscore, mock_rpc} from "./test_util";
import {toSearchKey} from "@ckb-lumos/ckb-indexer/lib/resultFormatter";


describe("get_cells", function () {

    it("[search_key,order,limit]",async ()=>{
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getCells(
            toSearchKey(requestData["params"][0])
            ,requestData["params"][1],requestData["params"][2])
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
    it("[search_key,order,limit,after]",async ()=>{
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getCells(
            toSearchKey(requestData["params"][0])
            ,requestData["params"][1],requestData["params"][2],requestData["params"][3])
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])

    })
});