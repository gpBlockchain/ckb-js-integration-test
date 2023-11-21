import { HexString} from "@ckb-lumos/base/lib/primitive";
import {Cell, config, helpers} from "@ckb-lumos/lumos";
import {BI} from "@ckb-lumos/bi";
import {utils} from "@ckb-lumos/base";
import {TransactionSkeletonType} from "@ckb-lumos/helpers";
import {deployContractByPath, DeployType, getDeployScriptConfig, ScriptConfig} from "../deploy";
import {Account, buildTransaction, generateAccountFromPrivateKey} from "../txService";
import {CKB_CONFIG, RPCClient} from "../../config/config";
import {FeeRate} from "../transfer";

const codeFilePath = "service/contract/LoopContractBin"

export const LoopContractConfig: ScriptConfig = {
    CODE_HASH: "0x8a8eb94a4fb9c8fbd899f60cb3e0813cc5aca0e03af5c159ae4ede50fde03655",
    HASH_TYPE: "data1",
    TX_HASH: "0x819e831c7b868f3af86a58ddb3175f84685dede333c031a68ee2098f7ec65f4f",
    INDEX: "0x1",
    DEP_TYPE: "code"
}

export const ARG_CPU:HexString = "0x02"
export  const ARG_MEM:HexString = "0x01"
export class LoopContract {

    sc: ScriptConfig;
    account: Account;
    privateKey: string;


    constructor(privateKey: string,sc?:ScriptConfig) {
        this.privateKey = privateKey
        this.account = generateAccountFromPrivateKey(this.privateKey)
        this.sc = sc
    }
    async deploy() :Promise<ScriptConfig>{
        if (this.sc == null){
            let tx  = await deployContractByPath(this.privateKey, codeFilePath, DeployType.typeId)
            let txHash = await RPCClient.sendTransaction(tx)
            this.sc = await getDeployScriptConfig(txHash,0,DeployType.typeId)
            console.log("deploy msg :",this.sc)
            return this.sc;
        }
        return this.sc;
    }

    //export interface buildTransferOpt {
    //     ckbUrl: string;
    //     from: string;
    //     outputCells: Cell[];
    //     inputCells?: Cell[];
    //     deps?: CellDep[];
    // }

    buildTx(loopCount: number, type: HexString) :Promise<TransactionSkeletonType>{
        console.log('addr:',this.account.address)
        return  buildTransaction({
            from: this.account.address,
            outputCells: [this._gen_out_put_cell(loopCount, type)],
            deps: [{
                outPoint: {
                    txHash: this.sc.TX_HASH,
                    index: this.sc.INDEX
                },
                depType: "code"
            },{
                outPoint:{
                    txHash: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.TX_HASH,
                    index: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.INDEX,
                },
                depType:CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.DEP_TYPE
            }]
        })
    }
    buildTxWithInput(loopCount: number, type: HexString,inputs:Cell[] ) :Promise<TransactionSkeletonType>{
        console.log('addr:',this.account.address)

        let outputCell  = this._gen_out_put_cell(loopCount, type)
        if(BI.from(outputCell.cellOutput.capacity).toBigInt()>= BI.from(inputs[0].cellOutput.capacity).toBigInt()){
            outputCell.cellOutput.capacity = BI.from(inputs[0].cellOutput.capacity).sub(FeeRate.NORMAL).toHexString()
        }

        return  buildTransaction({
            from: this.account.address,
            outputCells: [outputCell],
            inputCells:inputs,
            deps: [{
                outPoint: {
                    txHash: this.sc.TX_HASH,
                    index: this.sc.INDEX
                },
                depType: "code"
            },{
                outPoint:{
                    txHash: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.TX_HASH,
                    index: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.INDEX,
                },
                depType:CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.DEP_TYPE
            }]
        })
    }

    _gen_out_put_cell(loopCount: number, type: HexString) {
        const toScript = helpers.addressToScript(this.account.address,{config:config.predefined.AGGRON4});
        return {
            cellOutput: {
                capacity: BI.from(500).mul(100000000).toHexString(),
                lock: toScript,
                type: {
                    codeHash: this.sc.CODE_HASH,
                    hashType: this.sc.HASH_TYPE,
                    args: type
                }
            },
            data: utils.toBigUInt128LE(loopCount),
        };
    }

}
