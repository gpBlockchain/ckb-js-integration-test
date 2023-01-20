import {request} from "../util/util";
import {CKB_RPC_URL, RPCClient} from "../../config/config";
import {CKBComponents} from "@ckb-lumos/rpc/lib/types/api";
import {Hash, HexNumber} from "@ckb-lumos/base/lib/primitive";
import {expect} from "chai";


describe('get_transaction_and_witness_proof', function () {

    this.timeout(1000_000)
    describe('txHashes', function () {

        it("a list of transactions in different orders，return same of proof",async ()=>{
            const block = await RPCClient.getBlock("0xadaa049a601126abb71b08b4d7d522bd26ce50fe68ac75d7ebedd65b41ad8c1d")
            const hashes = block.transactions.map(tx=>tx.hash).sort()
            const sortProof = await get_transaction_and_witness_proof(hashes)
            const notSortProof = await get_transaction_and_witness_proof( block.transactions.map(tx=>tx.hash))
            expect(sortProof).to.be.deep.equal(notSortProof)

        })


        it("tx hashes is empty,should return error:Empty transaction hashes", async () => {
            try {
                await get_transaction_and_witness_proof([])
            } catch (e) {
                expect(e.toString()).to.be.include("Empty transaction hashes")
                return
            }
            expect.fail("expected Empty transaction hashes ")
        })
        it("not exist txHashes,should return error: not yet in block", async () => {
            try {
                await get_transaction_and_witness_proof(["0xc3cfa08597c5a381e271dc6a307017b8c37fda75b0a8434fd776d10a1a99f651"])
            } catch (e) {
                expect(e.toString()).to.be.include("not yet in block")
                return
            }
            expect.fail("expected not yet in block")
        })

        it("exist hash,should return proof", async () => {
            const block = await RPCClient.getBlockByNumber("0x0")
            const txHash = block.transactions[0].hash
            const ret = await get_transaction_and_witness_proof([txHash])
            expect(ret.block_hash).to.be.equal(block.header.hash)
            //todo verify proof is right
        })

        it("exist hashes ,but not in same block,should return Not all transactions found in retrieved block", async () => {
            const block1 = await RPCClient.getBlockByNumber("0x0")
            const block2 = await RPCClient.getBlockByNumber("0x2")
            try {
                await get_transaction_and_witness_proof([block1.transactions[0].hash, block2.transactions[0].hash])
            } catch (e) {

                expect(e.toString()).to.be.include("Not all transactions found in retrieved block")
                return
            }
            expect.fail("expected error:Not all transactions found in retrieved block")
        })

        it("some exist hashes,some not exist hashes,should return ot yet in block", async () => {
            const block1 = await RPCClient.getBlockByNumber("0x0")
            const randNotExistHash = "0x1f8c79eb6671709633fe6a46de93c0fedc9c1b8a6527a18d3983879542635c9f"
            try {
                await get_transaction_and_witness_proof([block1.transactions[0].hash,randNotExistHash])
            }catch (e){
                expect(e.toString()).to.be.include("not yet in block")
                return
            }
            expect.fail("expected error: not yet in block")
        })

        it("dup hashes,should return xxx",async ()=>{
            const block1 = await RPCClient.getBlockByNumber("0x0")
            try {
                await get_transaction_and_witness_proof([block1.transactions[0].hash,block1.transactions[0].hash])
            }catch (e){
                expect(e.toString()).to.be.include("Duplicated tx_hash")
                return
            }
            expect.fail("expected error: Duplicated tx_hash")
        })


    });

    describe('block', function () {
        it("block is null,should successful",async ()=>{
            const block = await RPCClient.getBlockByNumber("0x0")
            const txHash = block.transactions[0].hash
            const ret = await get_transaction_and_witness_proof([txHash])
            expect(ret.block_hash).to.be.equal(block.header.hash)
        })

        it("block is 0x0",async ()=>{
            const block = await RPCClient.getBlockByNumber("0x0")

            const txHash = block.transactions[0].hash
            const ret = await get_transaction_and_witness_proof([txHash],block.header.hash)
            expect(ret.block_hash).to.be.equal(block.header.hash)
        })
        it("block is tip number",async ()=>{
            const block = await RPCClient.getTipHeader()
            const blockMsg = await RPCClient.getBlock(block.hash)
            const txHash = blockMsg.transactions[0].hash
            const ret = await get_transaction_and_witness_proof([txHash],block.hash)
            expect(ret.block_hash).to.be.equal(block.hash)
        })
        it("block is not exist hash,should return Not all transactions found in specified block",async ()=>{
            const block = await RPCClient.getBlockByNumber("0x0")
            const txHash = block.transactions[0].hash
            try {
                await get_transaction_and_witness_proof([txHash], "0x8f8c79eb6671709633fe6a46de93c0fedc9c1b8a6527a18d3983879542635c91")
            }catch (e){
                expect(e.toString()).to.be.include("Not all transactions found in specified block")
                return
            }
            expect.fail("expected:\"Not all transactions found in specified block\" ")
        })
        it("only have cell base tx ",async ()=>{

            const block = await RPCClient.getBlockByNumber("0x1")
            const txHash = block.transactions[0].hash
            const ret = await get_transaction_and_witness_proof([txHash],block.header.hash)
            expect(ret.block_hash).to.be.equal(block.header.hash)
        })
    });

    describe('txHashList，block', function () {
        it('exist tx_hash exist block but tx_hashes not in block  should failed', async () => {
            const block1 = await RPCClient.getBlockByNumber("0x1")
            const block2 = await RPCClient.getBlockByNumber("0x2")

            try {
                await get_transaction_and_witness_proof([block1.transactions[0].hash],block2.header.hash)
            }catch (e){
                expect(e.toString()).to.be.include("Not all transactions found in specified block")
                return ;
            }
            expect.fail("expected failed:Not all transactions found in specified block")
        });
        it("not exist txHash ,not exist block,should return not yet in block",async ()=>{
            const block1 = await RPCClient.getBlockByNumber("0x1")

            try {
                await get_transaction_and_witness_proof(["0xfa0072347417d8f9cd328ad52ed71f993abff8923ee19cd50fc56782c7aedc41"],block1.header.hash)
            }catch (e){
                expect(e.toString()).to.be.include("not yet in block")
                return ;
            }
            expect.fail("expected failed:not yet in block")
        })

        it("not exist txHash , exist block,should return not yet in block",async ()=>{
            try {
                await get_transaction_and_witness_proof(["0xfa0072347417d8f9cd328ad52ed71f993abff8923ee19cd50fc56782c7aedc41"],"0xfa0072347417d8f9cd328ad52ed71f993abff8923ee19cd50fc56782c7aedc42")
            }catch (e){
                expect(e.toString()).to.be.include("not yet in block")
                return ;
            }
            expect.fail("expected failed:not yet in block")
        })

    });

});

export interface MerkleProof {
    indices: HexNumber[];
    lemmas: Hash[];
}

export type TransactionAndWitnessProof = {
    block_hash: string;
    transactions_proof: MerkleProof;
    witnesses_proof: MerkleProof;
}


export async function get_transaction_and_witness_proof(transactionHashes: CKBComponents.Hash[], blockHash?: CKBComponents.Hash): Promise<TransactionAndWitnessProof> {
    return await request(1, CKB_RPC_URL, "get_transaction_and_witness_proof", [transactionHashes, blockHash])
}
