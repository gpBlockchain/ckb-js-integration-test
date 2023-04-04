import {ARG_CPU, LoopContract, LoopContractConfig} from "../../service/contract/LoopContract";
import {estimate_cycles, signTransaction} from "../../service/txService";
import {ACCOUNT_PRIVATE_1, CKB_RPC_URL, RPCClient} from "../../config/config";
import {expect} from "chai";
import {Sleep} from "../util/util";

describe('tx cycle', function () {

    this.timeout(1000000)
    it.skip("should return txHash when send tx : max cycle", async () => {
        const loopContract = new LoopContract(ACCOUNT_PRIVATE_1, LoopContractConfig)
        // await loopContract.deploy()
        const tx = await loopContract.buildTx(984044, ARG_CPU)
        console.log('tx:', JSON.stringify(tx))
        const signedTx = signTransaction(tx, ACCOUNT_PRIVATE_1)
        let txHash = await RPCClient.sendTransaction(signedTx)
        for (let i = 0; i < 100; i++) {
            const txResponse = await RPCClient.getTransaction(txHash)
            console.log(txResponse.txStatus.status)
            if (txResponse.txStatus.status === "committed") {
                return
            }
            await Sleep(1000)
        }
        expect.fail("failed")
    })

    it("should return rejected when send tx : out of  max cycle ", async () => {
        const loopContract = new LoopContract(ACCOUNT_PRIVATE_1, LoopContractConfig)
        // await loopContract.deploy()
        const tx = await loopContract.buildTx(984046, ARG_CPU)
        console.log('tx:', JSON.stringify(tx))
        const signedTx = signTransaction(tx, ACCOUNT_PRIVATE_1)
        const result = await RPCClient.sendTransaction(signedTx)
        for (let i = 0; i < 100; i++) {
            const txResponse = await RPCClient.getTransaction(result)
            console.log(txResponse.txStatus.status)
            if (txResponse.txStatus.status === "rejected") {
                return
            }
            await Sleep(1000)
        }
        expect.fail("failed")
    })

    it("should return cycle when esGas :max cycle ", async () => {
        const loopContract = new LoopContract(ACCOUNT_PRIVATE_1, LoopContractConfig)
        // await loopContract.deploy()
        const tx = await loopContract.buildTx(984044, ARG_CPU)
        console.log('tx:', JSON.stringify(tx))
        const signedTx = signTransaction(tx, ACCOUNT_PRIVATE_1)
         await estimate_cycles(CKB_RPC_URL, signedTx)
    })

    it("should return error when esGas: out of  max cycle", async () => {
        const loopContract = new LoopContract(ACCOUNT_PRIVATE_1, LoopContractConfig)
        // await loopContract.deploy()
        const tx = await loopContract.buildTx(984046, ARG_CPU)
        console.log('tx:', JSON.stringify(tx))
        const signedTx = signTransaction(tx, ACCOUNT_PRIVATE_1)
        try {
            await estimate_cycles(CKB_RPC_URL, signedTx)
        } catch (e) {
            expect(e.toString()).to.include("TransactionFailedToVerify")
            return
        }
        expect.fail("failed")
    })
});
