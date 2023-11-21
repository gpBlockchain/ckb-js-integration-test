import {getSUDTBalance, getSUDTokenId, issueToken, transferUSDT} from "../../service/sudt";
import {ACCOUNT_PRIVATE_1, ACCOUNT_PRIVATE_2, CKB_CONFIG, RPCClient} from "../../config/config";
import {generateAccountFromPrivateKey} from "../../service/txService";
import {BI, helpers} from "@ckb-lumos/lumos";
import {utils} from "@ckb-lumos/base";

describe.skip('sudt', function () {


    this.timeout(1000000)
    it('mint', async () => {
        const tx = await issueToken(ACCOUNT_PRIVATE_1, "1000")
        const txHash = await RPCClient.sendTransaction(tx)
        console.log('txHash:',txHash)
    });

    it('transfer', async () => {
        //0xdafc5b41976c1da52cfc647a90d0af43c5e512c8060af85b21ae7025ee6fb8e8
        const account = generateAccountFromPrivateKey(ACCOUNT_PRIVATE_1);
        const account2 = generateAccountFromPrivateKey(ACCOUNT_PRIVATE_2);
        const tokenId = getSUDTokenId(account.address)
        let txMsg = await transferUSDT(ACCOUNT_PRIVATE_1,tokenId,account2.address,"100")
        await RPCClient.sendTransaction(txMsg)
    })
    it("query balance",async ()=>{
        const account1 = generateAccountFromPrivateKey(ACCOUNT_PRIVATE_1);
        console.log(account1.address)
        const account = generateAccountFromPrivateKey(ACCOUNT_PRIVATE_2);
        const tokenId = getSUDTokenId(account1.address)
        const balance = await getSUDTBalance(tokenId,account.address)
        console.log(balance)
    })

    it("decode tx",async ()=>{
        // tx:
        let tx = "0xc2f958d4c631a2a55c190d2e86d8a719f0e2b553cebea9c81c559c1697f08e39"
        const txMsg = await RPCClient.getTransaction(tx)

            // print address, token id , amount
        // print amount total
        console.log("input:")
        let amountIn = BI.from(0)
        let amountOut = BI.from(0)
        for (let i = 0; i < txMsg.transaction.inputs.length; i++) {
            let input = txMsg.transaction.inputs[i]
            const tx = await RPCClient.getTransaction(input.previousOutput.txHash)
            if (tx.transaction.outputs[BI.from(input.previousOutput.index).toNumber()].type?.codeHash == CKB_CONFIG.SCRIPTS.SUDT.CODE_HASH)
            {
                console.log("address:",helpers.encodeToAddress(tx.transaction.outputs[BI.from(input.previousOutput.index).toNumber()].lock),
                    "token Id:",tx.transaction.outputs[BI.from(input.previousOutput.index).toNumber()].type.args,
                    "amount:",utils.readBigUInt128LE(tx.transaction.outputsData[BI.from(input.previousOutput.index).toNumber()])
                    )
                amountIn = amountIn.add(utils.readBigUInt128LE(tx.transaction.outputsData[BI.from(input.previousOutput.index).toNumber()]))
            }

        }
        console.log("output")
        for (let j = 0; j < txMsg.transaction.outputs.length; j++) {
            let output = txMsg.transaction.outputs[j];

            if (output.type?.codeHash == CKB_CONFIG.SCRIPTS.SUDT.CODE_HASH)
            {
                console.log("address:",helpers.encodeToAddress(output.lock),
                    "token Id:",txMsg.transaction.outputs[j].type.args,
                    "amount:",utils.readBigUInt128LE(txMsg.transaction.outputsData[j])
                )
                amountOut = amountOut.add(utils.readBigUInt128LE(txMsg.transaction.outputsData[j]))
            }
        }

        // print ckbAddress out token id ,
        console.log("amountIn:",amountIn.toBigInt())
        console.log("amountOut:",amountOut.toBigInt())

    })
});

