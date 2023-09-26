import axios from 'axios';
import {camelCaseToUnderscore, mock_rpc} from "./test_util";
import {RPC} from "@ckb-lumos/rpc";

describe('get_header_by_number', function () {

    it('[block_number]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let block = await RPCClient.getHeaderByNumber(requestData["params"][0])
        expect(camelCaseToUnderscore(block)).toEqual(responseData['result'])
    });
    it.skip("[block_number,null]", async () => {
    })
    it.skip("[block_number,verbosity=0]", async () => {
    })
    it.skip("[block_number,verbosity=1]",async ()=>{})
});