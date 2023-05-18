import {Address, BI, Cell, commons, hd, helpers, Indexer, Script, Transaction, WitnessArgs} from "@ckb-lumos/lumos";
import {CKB_CONFIG, CKB_RPC_INDEX_URL, CKB_RPC_URL} from "../config/config";
import {TransactionSkeletonType} from "@ckb-lumos/helpers";
import {Hash, HexString} from "@ckb-lumos/base/lib/primitive";
import {CellDep} from "@ckb-lumos/base/lib/api";
import {CKBComponents} from "@ckb-lumos/rpc/lib/types/api";
import {formatter as paramsFmts} from "@ckb-lumos/rpc/lib/paramsFormatter";
import {request, Sleep} from "../test/util/util";
import {blockchain, values} from "@ckb-lumos/base";
import {bytes} from "@ckb-lumos/codec";
import {buildTransferOpt, FeeRate} from "./transfer";
const {ScriptValue} = values;


export type Account = {
    lockScript: Script;
    address: Address;
    pubKey: string;
};
export const generateAccountFromPrivateKey = (privKey: string): Account => {
    const pubKey = hd.key.privateToPublic(privKey);
    const args = hd.key.publicKeyToBlake160(pubKey);
    const lockScript:Script = {
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
    const signatures = txSkeleton
        .get("signingEntries")
        .map((entry) => hd.key.signRecoverable(entry.message, privKey))
        .toArray();
    return helpers.sealTransaction(txSkeleton, signatures);
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

export async function buildTransactionWithTxType(txSkeleton: TransactionSkeletonType, options: buildTransferOpt): Promise<TransactionSkeletonType> {
    // const defaultIndexer = new Indexer(CKB_PRC_URL1, options.ckbUrl);
    const defaultIndexer = new Indexer( CKB_RPC_INDEX_URL, CKB_RPC_URL);
    const fromScript = helpers.parseAddress(options.from, {config: CKB_CONFIG});
    let neededCapacity = BI.from(0)
    const collected: Cell[] = [];
    let collectedSum = BI.from(0);

    // 1. 检查构造这笔交易最少需要多少cell
    for (let i = 0; i < options.outputCells.length; i++) {
        neededCapacity = neededCapacity.add(options.outputCells[i].cellOutput.capacity)
    }
    //todo 补充txSkeleton的output
    for (let i = 0; i < txSkeleton.get("outputs").size; i++) {
        neededCapacity = neededCapacity.add(txSkeleton.get("outputs").get(i).cellOutput.capacity)
    }


    // 计算减到input的cap后还需要多少cap ， neededCapacity = input.cap -output.cap
    // todo: 补充txSkeleton之前的input
    if(options.inputCells!= undefined) {
        for (let i = 0; i < options.inputCells.length; i++) {
            // todo : check live cell capacity
            if (neededCapacity.lte(options.inputCells[i].cellOutput.capacity)) {
                neededCapacity = BI.from(0)
                break;
            }
            neededCapacity = neededCapacity.sub(options.inputCells[i].cellOutput.capacity)
        }
    }
    console.log("this tx need extra capacity:", neededCapacity.toNumber())

    // 将inputcell添加到collected
    // todo: 补充txSkeleton之前的input
    if(options.inputCells!= undefined){
        for (let i = 0; i <options.inputCells.length ; i++) {
            collected.push(options.inputCells[i])
            collectedSum = collectedSum.add(options.inputCells[i].cellOutput.capacity)
            console.log("push cell cap:",options.inputCells[i].cellOutput.capacity)
            console.log('current collectedSum:',collectedSum.toNumber())
        }
    }

    // 如果neededCapacity>0 或者 input 的长度为空
    // todo: 补充txSkeleton之前的input
    const collector = defaultIndexer.collector({lock: fromScript, type: "empty"});
    if(neededCapacity.gt(BI.from(0)) || collected.length == 0) {
        for await (const cell of collector.collect()) {
            collectedSum = collectedSum.add(cell.cellOutput.capacity);
            console.log("collectedSum:", collectedSum.toNumber())
            collected.push(cell);
            if (collectedSum.gt(neededCapacity)) {
                console.log("break collect")
                break;
            }
        }
    }
    console.log('total cell balance: ', collectedSum.toString())

    if (collectedSum.lt(neededCapacity)) {
        throw new Error("Not enough CKB");
    }

    if (collectedSum.sub(neededCapacity).sub(FeeRate.NORMAL).gt(BI.from('0'))) {
        const changeOutput: Cell = {
            cellOutput: {
                capacity: collectedSum.sub(neededCapacity).sub(FeeRate.NORMAL).toHexString(),
                lock: fromScript,
            },
            data: "0x",
        };
        console.log('gen out put extra value ')
        if (collectedSum.sub(neededCapacity).sub(FeeRate.NORMAL).gt(6100000000)) {
            txSkeleton = txSkeleton.update("outputs", (outputs) => outputs.push(changeOutput));
        } else {
            options.outputCells[0].cellOutput.capacity = collectedSum.sub(neededCapacity).sub(FeeRate.NORMAL).add(options.outputCells[0].cellOutput.capacity).toHexString()
        }
    }

    txSkeleton = txSkeleton.update("inputs", (inputs) => inputs.push(...collected));
    txSkeleton = txSkeleton.update("outputs", (outputs) => outputs.push(...options.outputCells));
    txSkeleton = txSkeleton.update("cellDeps", (cellDeps) =>
        cellDeps.push(...[
            ...options.deps,
            // {
            //     outPoint: {
            //         txHash: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.TX_HASH,
            //         index: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.INDEX,
            //     },
            //     depType: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.DEP_TYPE,
            // }
        ])
    );
    // if(options.deps!= undefined){
    //     console.log("options.deps:",options.deps)
    //     txSkeleton = txSkeleton.update("cellDeps", (cellDeps) => cellDeps.push(...options.deps));
    // }

    const firstIndex = txSkeleton
        .get("inputs")
        .findIndex((input) =>
            new ScriptValue(input.cellOutput.lock, {validate: false}).equals(
                new ScriptValue(fromScript, {validate: false})
            )
        );
    if (firstIndex !== -1) {
        console.log(" txSkeleton.get(\"witnesses\").size:", txSkeleton.get("witnesses").size)
        while (firstIndex >= txSkeleton.get("witnesses").size) {
            txSkeleton = txSkeleton.update("witnesses", (witnesses) => witnesses.push("0x"));
        }
        let witness: string = txSkeleton.get("witnesses").get(firstIndex)!;
        const newWitnessArgs: WitnessArgs = {
            /* 65-byte zeros in hex */
            lock:
                "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        };
        if (witness !== "0x") {
            const witnessArgs = blockchain.WitnessArgs.unpack(bytes.bytify(witness))
            const lock = witnessArgs.lock;
            if (!!lock && lock !== newWitnessArgs.lock) {
                throw new Error("Lock field in first witness is set aside for signature!");
            }
            const inputType = witnessArgs.inputType;
            if (!!inputType) {
                newWitnessArgs.inputType = inputType;
            }
            const outputType = witnessArgs.outputType;
            if (!!outputType) {
                newWitnessArgs.outputType = outputType;
            }
        }
        witness = bytes.hexify(blockchain.WitnessArgs.pack(newWitnessArgs))
        txSkeleton = txSkeleton.update("witnesses", (witnesses) => witnesses.set(firstIndex, witness));
    }
    return txSkeleton;
}

export async function buildTransaction(options: buildTransferOpt): Promise<TransactionSkeletonType> {
    let txSkeleton = helpers.TransactionSkeleton({});
    return buildTransactionWithTxType(txSkeleton, options)
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
