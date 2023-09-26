import axios from 'axios';
import {mock_rpc} from "./test_util";

describe('get_header', function () {

    it.skip('[block_hash,verbosity=0]', async () => {
        let {RPCClient, requestData, responseData} =await mock_rpc()
        let block = await RPCClient.getHeader(requestData["params"][0])
        expect(block.extraHash).toEqual(responseData['result']['extra_hash'])
    });

    it.skip('[block_hash,verbosity=1]', async () => {
    })

    it('[block_hash]', async () => {
        let {RPCClient, requestData, responseData} =await mock_rpc()
        let block = await RPCClient.getHeader(requestData["params"][0])
        expect(block.extraHash).toEqual(responseData['result']['extra_hash'])
    });
});