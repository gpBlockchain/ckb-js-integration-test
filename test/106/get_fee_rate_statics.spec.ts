/**
 * Request
 *
 *
 * ```
 * {
 *   "id": 42,
 *   "jsonrpc": "2.0",
 *   "method": "get_fee_rate_statics",
 *   "params": []
 * }
 * ```
 *
 *
 * Response
 *
 *
 * ```
 * {
 *   "id": 42,
 *   "jsonrpc": "2.0",
 *   "result": {
 *     "mean": "0xe79d",
 *     "median": "0x14a8"
 *    }
 * }
 * ```
 */

import {CKB_RPC_URL} from "../../config/config";
import {request} from "../util/util";
import {expect} from "chai";

describe('get_fee_rate_statics', function () {
    it("[],should return FeeRateResponse", async () => {
        //todo :wait lumos adapt
        const response = await get_fee_rate_statics()
        expect(response.mean).to.be.not.equal(undefined)
        expect(response.median).to.be.not.equal(undefined)
    })
    it("targe!= null,should return FeeRateResponse",async ()=>{
        //todo :wait lumos adapt

        const response = await get_fee_rate_statics_with_targe("0x12")
        expect(response.mean).to.be.not.equal(undefined)
        expect(response.median).to.be.not.equal(undefined)
    })
    it("targe is out of (1-101),should return FeeRateResponse",async ()=>{
        //todo :wait lumos adapt

        const response = await get_fee_rate_statics_with_targe("0x12000")
        expect(response.mean).to.be.not.equal(undefined)
        expect(response.median).to.be.not.equal(undefined)
    })
});


export type FeeRateResponse = {
    mean: string;
    median: string;
}

async function get_fee_rate_statics_with_targe(targe:string):Promise<FeeRateResponse>{
    let response = await request(1,CKB_RPC_URL,"get_fee_rate_statics",[targe])
    return {
        mean: response.mean,
        median: response.median
    };

}

async function get_fee_rate_statics(): Promise<FeeRateResponse> {
    let response = await request(1,CKB_RPC_URL,"get_fee_rate_statics")
    return {
        mean: response.mean,
        median: response.median
    };
}

