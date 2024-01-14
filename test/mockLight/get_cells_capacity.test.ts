import {camelCaseToUnderscore, mock_light_rpc, mock_rpc} from "../mock/test_util";
import {toSearchKey} from "@ckb-lumos/ckb-indexer/lib/resultFormatter";

describe("get_cells_capacity", function () {

    it("[search_key]", async () => {
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()

        let response = await LightRPCClient.getCellsCapacity(
            {
                script: toSearchKey(requestData['params'][0]).script,
                scriptType: toSearchKey(requestData['params'][0]).scriptType,
            }
        )
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});