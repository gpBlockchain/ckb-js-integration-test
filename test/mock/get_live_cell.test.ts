import {camelCaseToUnderscore, mock_rpc} from "./test_util";
import {toOutPoint} from "@ckb-lumos/rpc/lib/resultFormatter";


describe("get_live_cell", function () {

    it("[out_point,with_data=false]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getLiveCell(toOutPoint(requestData['params'][0]), requestData['params'][1])
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })

    it("[out_point,with_data=true]", async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let response = await RPCClient.getLiveCell(toOutPoint(requestData['params'][0]), requestData['params'][1])
        expect(camelCaseToUnderscore(response)).toEqual(responseData["result"])
    })
});