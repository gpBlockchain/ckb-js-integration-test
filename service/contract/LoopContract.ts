import { HexString} from "@ckb-lumos/base/lib/primitive";
import {config, helpers} from "@ckb-lumos/lumos";
import {BI} from "@ckb-lumos/bi";
import {utils} from "@ckb-lumos/base";
import {TransactionSkeletonType} from "@ckb-lumos/helpers";
import {deployContractByPath, DeployType, ScriptConfig} from "../deploy";
import {Account, generateAccountFromPrivateKey} from "../txService";
import {CKB_RPC_URL} from "../../config/config";
import {buildTransaction} from "../transfer";

const codeFilePath = "service/contract/LoopContract"

export const LoopContractConfig: ScriptConfig = {
    CODE_HASH: "0x8a8eb94a4fb9c8fbd899f60cb3e0813cc5aca0e03af5c159ae4ede50fde03655",
    HASH_TYPE: "data1",
    TX_HASH: "0x819e831c7b868f3af86a58ddb3175f84685dede333c031a68ee2098f7ec65f4f",
    INDEX: "0x1",
    DEP_TYPE: "code"
}

export const ARG_CPU:HexString = "0x123456"
export  const ARG_MEM:HexString = "0x12"
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
            this.sc = await deployContractByPath(CKB_RPC_URL,this.privateKey, codeFilePath, DeployType.data)
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
            ckbUrl:CKB_RPC_URL,
            from: this.account.address,
            outputCells: [this._gen_out_put_cell(loopCount, type)],
            deps: [{
                outPoint: {
                    txHash: this.sc.TX_HASH,
                    index: this.sc.INDEX
                },
                depType: "code"
            }]
        })
    }

    _gen_out_put_cell(loopCount: number, type: HexString) {
        const toScript = helpers.addressToScript(this.account.address,{config:config.predefined.AGGRON4});
        return {
            cellOutput: {
                capacity: BI.from(1000).mul(100000000).toHexString(),
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
