import { HexString} from "@ckb-lumos/base/lib/primitive";
import { config, helpers, Transaction} from "@ckb-lumos/lumos";
import {BI} from "@ckb-lumos/bi";
import {Cell, utils} from "@ckb-lumos/base";
import {TransactionSkeletonType} from "@ckb-lumos/helpers";
import {deployContractByPath, DeployType, getDeployScriptConfig, ScriptConfig} from "../deploy";
import {Account, buildTransaction, generateAccountFromPrivateKey, signTransaction} from "../txService";
import {CKB_CONFIG, CKB_RPC_URL, RPCClient} from "../../config/config";

const codeFilePath = "service/contract/spawn_peak_memory_2m_to_32m"

export const SpawnPeakMemory2mTo32mContractConfig: ScriptConfig = {
    CODE_HASH: '0x241ef40220f5650c4b7ceeb7ab31cbbb977d81c6c344dcd9825d9c942f8f9724',
    HASH_TYPE: 'data1',
    TX_HASH: '0xbd2f3c35bb487316b30d2749112fca74fe6ed8c62d891f634c171f6e31f2b528',
    INDEX: '0x0',
    DEP_TYPE: 'code'
}



export class SpawnPeakMemory2mTo32mContract {

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

    async  buildTx() :Promise<Transaction>{
        console.log('addr:',this.account.address)
        let tx  = await   buildTransaction({
            from: this.account.address,
            outputCells: [this._gen_out_put_cell()],
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
        return signTransaction(tx,this.privateKey)
    }

    _gen_out_put_cell():Cell {
        const toScript = helpers.addressToScript(this.account.address,{config:config.predefined.AGGRON4});
        return {
            cellOutput: {
                capacity: BI.from(1000).mul(100000000).toHexString(),
                lock: toScript,
                type: {
                    codeHash: this.sc.CODE_HASH,
                    hashType: this.sc.HASH_TYPE,
                    args: '0x'
                }
            },
            data: '0x'
        };
    }

}
