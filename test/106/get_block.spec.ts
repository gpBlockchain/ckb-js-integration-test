/**
 * #### Method `get_block`
 * * `get_block(block_hash, verbosity, with_cycles)`
 *     * `block_hash`: [`H256`](#type-h256)
 *     * `verbosity`: [`Uint32`](#type-uint32) `|` `null`
 *     * `with_cycles`: `boolean` `|` `null`
 * * result: [`BlockResponse`](#type-blockresponse) `|` `null`
 *
 */

import {request} from "../util/util";
import {CKB_RPC_URL, RPCClient} from "../../config/config";
import {CKBComponents} from "@ckb-lumos/rpc/lib/types/api";
import {expect} from "chai";

describe('get_block', function () {

    let existBLockHash
    this.timeout(100000_000)
    before(async () => {
        existBLockHash = await RPCClient.getBlockHash("0x1");
        console.log("hash:", existBLockHash)
    })
    it("with_cycles:null,verbosity:0x0,should return blockView", async () => {
        //todo wait lumos adapt
        const res = await get_serialized_block(existBLockHash)
        expect(res).to.be.include("0x")
    })
    it("with_cycles:null,verbosity:0x2,should return blockView", async () => {
        const res = await get_block_view(existBLockHash)
        expect(res.header).to.be.not.equal(undefined)
    })
    it("with_cycles:false == false ,verbosity:0x2,should return blockView", async () => {
        // with_cycles:false == null
    })
    it("with_cycles:false,verbosity:0x0,should return blockView", async () => {
        // with_cycles:false == null
    })

    it("with_cycles:true,verbosity:0x2,should return response that contains block and cycles ", async () => {
        //todo wait lumos adapt
        const res = await get_block_view_with_cycle(existBLockHash)
        console.log(res)
        expect(res.block).to.be.not.equal(undefined)
        expect(res.cycles).to.be.not.equal(undefined)
    })

    it("with_cycles:true,verbosity:0x0,should return  block is hexString,and contains array", async () => {
        //todo wait lumos adapt
        const res = await get_serialized_block_with_cycle(existBLockHash)
        console.log(res)
        expect(res.block).to.be.include("0x")
        expect(res.cycles).to.be.not.equal(undefined)
    })


});

export type BlockViewWithCycles = {
    block: any;
    cycles: string[];
}

export type SerializedBlockWithCycle = {
    block: string;
    cycles: string[];
}

/**
 * verbosity : 0x0
 * @param block_hash
 */
async function get_serialized_block(block_hash: string): Promise<string> {
    return await request(1, CKB_RPC_URL, "get_block", [block_hash, "0x0", null])
}

async function get_serialized_block_with_cycle(block_hash: string): Promise<SerializedBlockWithCycle> {
    const res = await request(1, CKB_RPC_URL, "get_block", [block_hash, "0x0", true])
    return {
        block: res.block,
        cycles: res.cycles
    };
}

async function get_block_view_with_cycle(block_hash: string): Promise<BlockViewWithCycles> {
    const res = await request(1, CKB_RPC_URL, "get_block", [block_hash, "0x2", true])
    return {
        block: res.block,
        cycles: res.cycles
    };
}

/**
 * verbosity:0x2
 * @param block_hash
 */
async function get_block_view(block_hash: string): Promise<CKBComponents.Block> {
    return await RPCClient.getBlock(block_hash)
}


async function get_block(block_hash: string, verbosity: "0x0" | "0x1" | "0x2" | null, with_cycles: boolean | null): Promise<any> {
    const response = await request(1, CKB_RPC_URL, "get_block", [block_hash, verbosity, with_cycles])
    return response;
}
