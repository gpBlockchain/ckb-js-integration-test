import {camelCaseToUnderscore, mock_light_rpc} from "../mock/test_util";
import {toSearchKey} from "@ckb-lumos/ckb-indexer/lib/resultFormatter";

describe("get_transactions", function () {

    it("groupedTxWithCells:js", async () => {
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()
        let response = await LightRPCClient.getTransactions(
            {
                script: toSearchKey(requestData['params'][0]).script,
                scriptType: toSearchKey(requestData['params'][0]).scriptType,
                groupByTransaction: true,
            }, requestData['params'][1], requestData['params'][2]
        )
        console.log(response.objects)
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })

    it("ungroupedTxWithCell:js",async ()=>{
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()
        let response = await LightRPCClient.getTransactions(
            {
                script: toSearchKey(requestData['params'][0]).script,
                scriptType: toSearchKey(requestData['params'][0]).scriptType
            }, requestData['params'][1], requestData['params'][2]
        )
        console.log(response.objects)
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});