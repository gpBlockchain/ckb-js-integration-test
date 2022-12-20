/**
 * * `get_block_by_number(block_number, verbosity, with_cycles)`
 *     * `block_number`: [`BlockNumber`](#type-blocknumber)
 *     * `verbosity`: [`Uint32`](#type-uint32) `|` `null`
 *     * `with_cycles`: `boolean` `|` `null`
 * * result: [`BlockResponse`](#type-blockresponse) `|` `null`
 *
 */

import {CKB_RPC_URL, RPCClient} from "../../config/config";
import {BlockViewWithCycles, SerializedBlockWithCycle} from "./get_block.spec";
import {request} from "../util/util";
import {expect} from "chai";

describe('get_block_by_number', function () {
    it("with_cycles:null",async ()=>{
        const response = await RPCClient.getBlockByNumber("0x1")
        expect(response.transactions).to.be.not.equal(undefined)
    })
    it("verbosity:0x0,cycles:false,should return Serialized block",async ()=>{
        //todo :wait lumos adapt
        const res = await get_serialized_block_by_number("0x1")
        expect(res).to.be.include("0x")
    })
    it("with_cycles:false,verbosity:0x2,should return blockView",async ()=>{
        // with_cycles :false = null
    })

    it("verbosity:0x0,cycles:true,should return Serialized block with cycles",async ()=>{
        //todo :wait lumos adapt
        const res = await get_serialized_block_with_cycle_by_number("0x1")
        expect(res.block).to.be.include("0x")
        expect(res.cycles).to.be.not.equal(undefined)
    })

    it("with_cycles:true,verbosity:0x2,should return block with cycles",async ()=>{
        //todo :wait lumos adapt
        const res = await get_block_view_by_number_with_cycles("0x1")
        console.log("res:",res)
        expect(res.block).to.be.not.equal(undefined)
        expect(res.cycles).to.be.not.equal(undefined)
    })

});


async function get_serialized_block_by_number(number: string): Promise<string> {
    return await request(1, CKB_RPC_URL, "get_block_by_number", [number, "0x0", null])
}

async function get_serialized_block_with_cycle_by_number(number: string): Promise<SerializedBlockWithCycle> {
    const res = await request(1, CKB_RPC_URL, "get_block_by_number", [number, "0x0", true])
    return {
        block: res.block,
        cycles: res.cycles
    };
}
async function get_block_view_by_number_with_cycles(number:string):Promise<BlockViewWithCycles>{
    const res = await request(1,CKB_RPC_URL,"get_block_by_number",[number,"0x2",true])
    return {
        block:res.block,
        cycles:res.cycles
    }
}
