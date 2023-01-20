import {request} from "../util/util";
import {CKB_RPC_URL, RPCClient} from "../../config/config";
import {get_transaction_and_witness_proof, TransactionAndWitnessProof} from "./get_transaction_and_witness_proof.spec";
import {CKBComponents} from "@ckb-lumos/rpc/lib/types/api";
import {expect} from "chai";

// only support testnet
describe('verify_transaction_and_witness_proof', function () {

    this.timeout(1000_000)

    it("exist proofs",async ()=>{
        const block = await RPCClient.getBlock("0xadaa049a601126abb71b08b4d7d522bd26ce50fe68ac75d7ebedd65b41ad8c1d")
        const proof = await get_transaction_and_witness_proof(block.transactions.map(tx=>tx.hash))
        const verifyHashes = await verify_transaction_and_witness_proof(proof)
        console.log("verifyHashes:",verifyHashes)
        console.log("block hashes:",block.transactions.map(tx=>tx.hash))


    })
    it("exist proof",async ()=>{

        const block = await RPCClient.getBlock("0xadaa049a601126abb71b08b4d7d522bd26ce50fe68ac75d7ebedd65b41ad8c1d")
        const hashes = [ block.transactions[3].hash]
        const proof = await get_transaction_and_witness_proof(hashes)
        const verifyHashes = await verify_transaction_and_witness_proof(proof)
        console.log("hashes:",verifyHashes)

    })

    it("block is not exist  ",async ()=>{
        try {
            const verifyHashes = await verify_transaction_and_witness_proof(
                {
                    "block_hash": "0x12930899b1f33ed0544216195f5bcdbc5555800afc60a7d494b68bc7f1cddbc8",
                    "witnesses_proof": {
                        "indices": ["0x1", "0xb", "0xc", "0xf", "0xe", "0x10", "0xa", "0xd"],
                        "lemmas": ["0xb6a541279f13f8098b3958d00e2721c09f43ddebead5037a1197ab8c0272cf8b"]
                    },
                    "transactions_proof": {
                        "indices": ["0xc", "0xd", "0xf", "0x9", "0xe", "0x10", "0xb", "0xa"],
                        "lemmas": ["0x2e41af17d62b7a74d3f8c8048480d5fe6040ed3f6e9697dc492722ea2c743cd0"]
                    }
                }
            )
        }catch (e){
            expect(e.toString()).to.be.include("")
        }
    })

    it("block is not verify block ",async ()=>{
        const block = await RPCClient.getBlock("0xadaa049a601126abb71b08b4d7d522bd26ce50fe68ac75d7ebedd65b41ad8c1d")
        const hashes = [ block.transactions[3].hash]
        const proof = await get_transaction_and_witness_proof(hashes)
        proof.block_hash = await RPCClient.getBlockHash("0x100")
        try {
            await verify_transaction_and_witness_proof(proof)
        }catch (e){
            expect(e.toString()).to.be.include("Invalid")
        }
        expect.fail("failed")
    })
    it("witnesses_proof is wrong",async ()=>{

        const block = await RPCClient.getBlock("0xadaa049a601126abb71b08b4d7d522bd26ce50fe68ac75d7ebedd65b41ad8c1d")
        let proof3 = await get_transaction_and_witness_proof([ block.transactions[3].hash])
        let proof4 = await get_transaction_and_witness_proof([ block.transactions[4].hash])
        proof3.witnesses_proof = proof4.witnesses_proof
        const hashes = await verify_transaction_and_witness_proof(proof3)
        console.log("hashes:",hashes)

    })

    it("witnesses_proof is wrong,should return Invalid transaction_and_witness proof",async ()=>{

        const block = await RPCClient.getBlock("0xadaa049a601126abb71b08b4d7d522bd26ce50fe68ac75d7ebedd65b41ad8c1d")
        let proof3 = await get_transaction_and_witness_proof([ block.transactions[3].hash])
        let proof4 = await get_transaction_and_witness_proof( block.transactions.map(tx=>tx.hash))
        proof3.witnesses_proof.indices = proof4.witnesses_proof.indices
        try {
            await verify_transaction_and_witness_proof(proof3)
        }catch (e){
            expect(e.toString()).to.be.include("Invalid transaction_and_witness proof")
            return
        }
        expect.fail("expected : Invalid transaction_and_witness proof")

    })

    it("transactions_proof is wrong,should return Invalid transaction_and_witness proof",async ()=>{

        const block = await RPCClient.getBlock("0xadaa049a601126abb71b08b4d7d522bd26ce50fe68ac75d7ebedd65b41ad8c1d")
        const proof3 = await get_transaction_and_witness_proof([ block.transactions[3].hash])
        const proof4 = await get_transaction_and_witness_proof([ block.transactions[4].hash])
        proof3.transactions_proof.indices = proof4.transactions_proof.indices
        try {
            await verify_transaction_and_witness_proof(proof3)
        }catch (e){
            expect(e.toString()).to.be.include("Invalid transaction_and_witness proof")
            return
        }
        expect.fail("expected : Invalid transaction_and_witness proof")

    })
});


export async function verify_transaction_and_witness_proof(proof:TransactionAndWitnessProof):Promise<CKBComponents.Hash[]>{
    return await request(1, CKB_RPC_URL, "verify_transaction_and_witness_proof", [proof])
}
