import {estimate_cycles, generateAccountFromPrivateKey, signTransaction} from "../../service/txService";
import {ACCOUNT_PRIVATE_1, CKB_RPC_URL, RPCClient} from "../../config/config";
import {helpers} from "@ckb-lumos/lumos";
import {buildTransactionWithTxType} from "../../service/transfer";
import {blockchain} from "@ckb-lumos/base";
import {hex, Sleep} from "../util/util";
import {TransactionSkeletonType} from "@ckb-lumos/helpers";
import {expect} from "chai";

describe('witness', function () {

    this.timeout(600000)
    it("should return cycle when esGas : max witness",async ()=>{
        const account = generateAccountFromPrivateKey(ACCOUNT_PRIVATE_1);
        //build type = "ibc-3156004029
        let txSkeleton = helpers.TransactionSkeleton({});
        txSkeleton = txAddWitness(txSkeleton,27641,2)
        // txSkeleton = txAddWitness(txSkeleton,1,10)
        const tx = await buildTransactionWithTxType(txSkeleton, {
            ckbUrl: CKB_RPC_URL,
            from: account.address,
            inputCells: [
            ],
            deps: [{
                outPoint: {
                    txHash: "0xe434764776df1bcbcf3ac96638a37928831c18ab52d1d4464f91d9268f87384b",
                    index: "0x0"
                },
                depType: "code"
            }, {
                outPoint: {
                    txHash: "0xe190989bdb60584170a45fe05573689456edac308390e024eb69dbaee1739865",
                    index: "0x0"
                },
                depType: "code"
            }],
            outputCells: [],
        })
        const signedTx = signTransaction(tx, ACCOUNT_PRIVATE_1)
        const rt = await estimate_cycles(CKB_RPC_URL,signedTx)
        console.log(rt)
    })

    it("should commit when send tx :max witness ",async ()=>{
        const account = generateAccountFromPrivateKey(ACCOUNT_PRIVATE_1);
        //build type = "ibc-3156004029
        let txSkeleton = helpers.TransactionSkeleton({});
        txSkeleton = txAddWitness(txSkeleton,17641,1)
        // txSkeleton = txAddWitness(txSkeleton,1,10)
        const tx = await buildTransactionWithTxType(txSkeleton, {
            ckbUrl: CKB_RPC_URL,
            from: account.address,
            inputCells: [
            ],
            deps: [{
                outPoint: {
                    txHash: "0xe434764776df1bcbcf3ac96638a37928831c18ab52d1d4464f91d9268f87384b",
                    index: "0x0"
                },
                depType: "code"
            }, {
                outPoint: {
                    txHash: "0xe190989bdb60584170a45fe05573689456edac308390e024eb69dbaee1739865",
                    index: "0x0"
                },
                depType: "code"
            }],
            outputCells: [],
        })
        const signedTx = signTransaction(tx, ACCOUNT_PRIVATE_1)
        let txHash = await RPCClient.sendTransaction(signedTx, "passthrough")
        for (let i = 0; i < 100; i++) {
            const txResponse = await RPCClient.getTransaction(txHash)
            console.log(txResponse.txStatus.status)
            if(txResponse.txStatus.status === "committed"){
                return
            }
            await Sleep(1000)
        }
        expect.fail("failed ")
    })

    it.skip("should failed when send tx : out of  max witness",async ()=>{
        const account = generateAccountFromPrivateKey(ACCOUNT_PRIVATE_1);
        //build type = "ibc-3156004029
        let txSkeleton = helpers.TransactionSkeleton({});
        txSkeleton = txAddWitness(txSkeleton,17642,1)
        // txSkeleton = txAddWitness(txSkeleton,1,10)
        const tx = await buildTransactionWithTxType(txSkeleton, {
            ckbUrl: CKB_RPC_URL,
            from: account.address,
            inputCells: [
            ],
            deps: [{
                outPoint: {
                    txHash: "0xe434764776df1bcbcf3ac96638a37928831c18ab52d1d4464f91d9268f87384b",
                    index: "0x0"
                },
                depType: "code"
            }, {
                outPoint: {
                    txHash: "0xe190989bdb60584170a45fe05573689456edac308390e024eb69dbaee1739865",
                    index: "0x0"
                },
                depType: "code"
            }],
            outputCells: [],
        })
        const signedTx = signTransaction(tx, ACCOUNT_PRIVATE_1)
        // const cycleResult=  await estimate_cycles(CKB_RPC_URL,signedTx)
        // console.log('cycle:',cycleResult)
        try {
            let txHash = await RPCClient.sendTransaction(signedTx, "passthrough")
        }catch (e){
            expect(e.toString()).to.be.include("PoolRejectedTransactionBySizeLimit")
            return;
        }
        expect.fail("expected failed ")
    })


    function txAddWitness(txSkeleton:TransactionSkeletonType,witnessLength:number,witnessSize:number):TransactionSkeletonType{
        function getHexBynum(num:number) {
            let hex = ""
            for (let i = 0; i < num; i++) {
                hex = `13${hex}`
            }
            return hex
        }

        const witness = blockchain.WitnessArgs.pack({
            inputType: `0x${getHexBynum(witnessSize)}`,
        })

        for (let i = 0; i < witnessLength; i++) {
            txSkeleton = txSkeleton.update("witnesses", (wits) => wits.push(`0x${hex(witness)}`));
        }
        return txSkeleton

    }

});
