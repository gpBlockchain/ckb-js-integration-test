import {RPCClient} from "../../config/config";
import {BI} from "@ckb-lumos/bi";
import {CKBComponents} from "@ckb-lumos/rpc/lib/types/api";
import SearchKey = CKBComponents.SearchKey;
import {CellbaseWitness} from "@ckb-lumos/lumos/codec/blockchain";
import { readFileSync, writeFileSync} from "fs";
import {encodeToAddress, parseAddress} from "@ckb-lumos/helpers";
import * as fs from 'fs';

describe('query empty block', function () {

    this.timeout(1000000000)
    let beginBlockNum = 12141607;
    // let beginBlockNum = 12151607;
    // let endBlockNum = 12161607;
    let endBlockNum = 12250353;
    let sendTxAddress = "ckb1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqfg4g0ffe4pxsl3x6fka87nt4eejssh7yqwkgkap";
    let containAddressJsonListFilePath = "/Users/guopenglin/WebstormProjects/gp1/ckb-js-integration-test/test/contract/data-12141607-12250353.json";
    let emptyBlockMessageFilePath = "/Users/guopenglin/WebstormProjects/gp1/ckb-js-integration-test/test/contract/data-miner-12141607-12250353.json";
    it("generate-tx-contains-block-json", async () => {
        let script = parseAddress(sendTxAddress)
        let containAddressBlockList = await getBlocks({
            script: script,
            scriptType: "lock",
            filter: {
                blockRange: [BI.from(beginBlockNum).toHexString(), BI.from(endBlockNum).toHexString()]
            }, scriptSearchMode: "exact",
            // groupByTransaction: true,
        })
        writeFileSync(containAddressJsonListFilePath, JSON.stringify({"contains_blocks": containAddressBlockList}))
    })

    it("get block message", async () => {
        let contains_block_str = readFileSync(containAddressJsonListFilePath)
        let contains_block = JSON.parse(contains_block_str.toString())

        let ret = []
        for (let i = 12173102; i < contains_block["contains_blocks"][contains_block["contains_blocks"].length - 1]; i++) {
            try {
                if (contains_block["contains_blocks"].indexOf(i) === -1) {
                    let block = await RPCClient.getBlockByNumber(BI.from(i).toHexString())
                    if (block.transactions.length === 1) {
                        let witness = CellbaseWitness.unpack(block.transactions[0].witnesses[0])
                        let minerAddress = encodeToAddress({
                            codeHash: witness.lock?.codeHash,
                            args: witness.lock?.args,
                            hashType: witness.lock?.hashType
                        });
                        console.log("block number:", i, " miner address:", minerAddress, "version:", hexToAscii(witness.message))
                        ret.push({
                            "block_number": i,
                            "miner_address": minerAddress,
                            "version": hexToAscii(witness.message)
                        })
                        fs.appendFileSync(emptyBlockMessageFilePath,JSON.stringify({
                            "block_number": i,
                            "miner_address": minerAddress,
                            "version": hexToAscii(witness.message)
                        })+"\n")
                    }
                } else {
                }
            } catch (e) {
                i--
            }

        }
    })



});


async function getBlocks(searchKey: SearchKey): Promise<number[]> {
    let ret = await RPCClient.getTransactions(searchKey, "asc", "0x666")
    let blocks = new Set<number>();
    ret.objects.forEach(indexer => {
        blocks.add(BI.from(indexer.blockNumber).toNumber())
        // return BI.from(indexer.blockNumber)
    })

    while (ret.lastCursor != "0x") {
        console.log(ret.lastCursor)
        console.log("query again ,block size:", blocks.size)
        try {
            ret = await RPCClient.getTransactions(searchKey, "asc", "0x6666", ret.lastCursor)
            ret.objects.forEach(indexer => {
                blocks.add(BI.from(indexer.blockNumber).toNumber())
            })
        }catch (e){

        }

    }
    let numbers = []
    blocks.forEach(number => {
        numbers.push(number)
    })
    return numbers
}


function hexToAscii(hexString: string): string {
    let hex = hexString.toString(); // 确保输入的是字符串类型
    hex = hex.replace("0x", "")
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}