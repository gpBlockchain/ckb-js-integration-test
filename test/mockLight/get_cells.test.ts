import {camelCaseToUnderscore, mock_light_rpc} from "../mock/test_util";
import {toSearchKey} from "@ckb-lumos/ckb-indexer/lib/resultFormatter";

describe("get_cells", function () {

    it("[search_key,order,limit,after_cursor]", async () => {
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()

        let response = await LightRPCClient.getCells(
            {
                script: toSearchKey(requestData['params'][0]).script,
                scriptType: toSearchKey(requestData['params'][0]).scriptType,
                withData: requestData["params"][0]['with_data']
            },
            requestData["params"][1],
            requestData["params"][2],
            requestData["params"][3]
        )
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
    it("[search_key,order,limit,null]", async () => {
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()
        let response = await LightRPCClient.getCells(
            {
                script: toSearchKey(requestData['params'][0]).script,
                scriptType: toSearchKey(requestData['params'][0]).scriptType,
                withData: requestData["params"][0]['with_data']
            }, requestData["params"][1],
            requestData["params"][2]
        )
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })

});