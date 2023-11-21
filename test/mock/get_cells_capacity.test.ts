import {camelCaseToUnderscore, mock_rpc} from "./test_util";
import {toSearchKey} from "@ckb-lumos/ckb-indexer/lib/resultFormatter";


describe("get_cells_capacity", function () {

    it("[search_key]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getCellsCapacity(
            toSearchKey(requestData["params"][0]))
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })

});