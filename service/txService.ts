import {Address, BI, Cell, commons, hd, helpers, Script, Transaction} from "@ckb-lumos/lumos";
import {CKB_CONFIG} from "../config/config";
import {TransactionSkeletonType} from "@ckb-lumos/helpers";
import {Hash, HexString} from "@ckb-lumos/base/lib/primitive";
import {CellDep} from "@ckb-lumos/base/lib/api";
import {CKBComponents} from "@ckb-lumos/rpc/lib/types/api";
import {formatter as paramsFmts} from "@ckb-lumos/rpc/lib/paramsFormatter";
import {request, Sleep} from "../test/util/util";


export type Account = {
    lockScript: Script;
    address: Address;
    pubKey: string;
};
export const generateAccountFromPrivateKey = (privKey: string): Account => {
    const pubKey = hd.key.privateToPublic(privKey);
    const args = hd.key.publicKeyToBlake160(pubKey);
    const lockScript = {
        codeHash: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.CODE_HASH,
        hashType: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.HASH_TYPE,
        args: args,
    };
    const address = helpers.encodeToAddress(lockScript, {config: CKB_CONFIG});
    return {
        lockScript,
        address,
        pubKey,
    };
};

export function signTransaction(txSkeleton: TransactionSkeletonType, privKey: string): Transaction {
    txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
    const message = txSkeleton.get("signingEntries").get(0)?.message;
    const Sig = hd.key.signRecoverable(message!, privKey);
    return helpers.sealTransaction(txSkeleton, [Sig]);
}

export async function waitTransactionCommit(hash: string, rpcClientUrl: string, waitSize: number): Promise<any> {
    let res;
    for (let i = 0; i < waitSize; i++) {
        res = await request(1, rpcClientUrl, "get_transaction", [hash]);
        if (res.tx_status.status === 'committed') {
            return res
        }
        await Sleep(1000)
    }
    return res
}

export interface AddTransactionMsg {
    cellDeps?: CellDep[];
    headerDeps?: Hash[];
    inputs?: Cell[];
    outputs?: Cell[];
    witnesses?: HexString[];
}

export interface getLockCellOpt{
    address:string,
    amount:string,
    data?:string
}


export  function getLockCell(opt:getLockCellOpt):Cell{
    const toScript = helpers.parseAddress(opt.address, {config: CKB_CONFIG});
    let cell:Cell =  {
        cellOutput: {
            capacity: BI.from(opt.amount).mul(100000000).toHexString(),
            lock: toScript,
        },
        data: "0x",
    };
    if (opt.data!= undefined){
        cell.data = opt.data
    }
    return cell
}

export async function addTransaction(tx: TransactionSkeletonType, addTxMsg: AddTransactionMsg): Promise<TransactionSkeletonType> {

    if (addTxMsg.inputs != undefined) {
        tx = tx.update("inputs", (inputs) => inputs.push(...addTxMsg.inputs));
    }

    if (addTxMsg.outputs != undefined) {
        tx = tx.update("outputs", (outputs) => outputs.push(...addTxMsg.outputs));
    }
    if (addTxMsg.witnesses != undefined) {
        tx = tx.update("witnesses", (witnesses) => witnesses.push(...addTxMsg.witnesses));
    }
    if(addTxMsg.cellDeps != undefined){
        tx = tx.update("cellDeps",(cellDeps)=>cellDeps.push(...addTxMsg.cellDeps))
    }
    return tx;

}
type CyclesResponse={
    cycles:string;
}

export async function estimate_cycles(CKB_RPC_URL:string,tx: CKBComponents.RawTransaction) :Promise<CyclesResponse>{
    const res = await request(1, CKB_RPC_URL, "estimate_cycles", [
        paramsFmts.toRawTransaction(tx)
    ]);
    return {
        cycles:res.cycles
    };
}
