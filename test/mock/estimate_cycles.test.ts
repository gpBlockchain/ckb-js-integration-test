import axios from 'axios';

jest.mock('axios');

import {toTransaction} from "@ckb-lumos/rpc/lib/resultFormatter";
import * as fs from 'fs';
import {mock_rpc} from "./test_util";

const mockRound = jest.spyOn(Math, 'round');


describe("estimate_cycles", function () {

    it("[tx]",async ()=>{
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let tx = toTransaction(requestData["params"][0])
        // @ts-ignore
        let response = await RPCClient.estimateCycles(tx)
        expect(response.cycles).toEqual(responseData["result"]["cycles"])
    })
});