/**
 * #### Method `get_header`
 * * `get_header(block_hash, verbosity)`
 *     * `block_hash`: [`H256`](#type-h256)
 *       "version": "0x0",
 *       "witnesses": []
 *     },
 *     "cycles": "0x219",
 *     "tx_status": {
 *       "block_hash": null,
 *       "status": "pending",
 *   "jsonrpc": "2.0",
 *   "result": {
 *     "transaction": "0x.....",
 *     "cycles": "0x219",
 *     "tx_status": {
 *       "block_hash": null,
 *       "status": "pending",
 * ```
 */
import {request} from "../util/util";
import {CKB_RPC_URL, RPCClient} from "../../config/config";
import {expect} from "chai";

describe('get_header', function () {

    let existBlockHash;
    before(async ()=>{
        existBlockHash = await RPCClient.getBlockHash("0x1")
    })
    it("verbosity is 1 or null ,should return blockView",async ()=>{
        const res = await get_header_verbosity_is_0(existBlockHash)
        expect(res.cycles).to.be.equal(undefined)
    })
    it("verbosity is 0,should return hexstring",async ()=>{
        // todo : wait lumos adapt
        const res = await get_header_verbosity_is_1(existBlockHash)
        expect(res).to.be.equal("0x")
    })

});

async function get_header_verbosity_is_0(block_hash:string) :Promise<any>{
    return await RPCClient.getHeader(block_hash)
}

async function get_header_verbosity_is_1(block_hash:string) :Promise<any>{
    return await request(1, CKB_RPC_URL, "get_header", [block_hash,"0x0"])
}
