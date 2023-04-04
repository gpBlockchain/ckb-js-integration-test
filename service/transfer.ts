import {BI, Cell, CellDep, helpers, Indexer, WitnessArgs} from "@ckb-lumos/lumos";
import {blockchain, values} from "@ckb-lumos/base"

import {CKB_CONFIG} from "../config/config";
import {bytes} from "@ckb-lumos/codec";
import {TransactionSkeletonType} from "@ckb-lumos/helpers";

const {ScriptValue} = values;

export enum FeeRate {
    SLOW = 508,
    NORMAL = 6847932,
    FAST = 10000000
}

interface transferOptions {
    from: string;
    to: string;
    amount: string;
}

interface Options {
    from: string;
    outputCells: Cell[];
    privKey: string;
    inputCells?: Cell[];
    deps?: CellDep[];
}

export interface buildTransferOpt {
    ckbUrl: string;
    from: string;
    outputCells: Cell[];
    inputCells?: Cell[];
    deps?: CellDep[];
}

export async function buildTransactionWithTxType(txSkeleton: TransactionSkeletonType, options: buildTransferOpt): Promise<TransactionSkeletonType> {
    const defaultIndexer = new Indexer(options.ckbUrl, options.ckbUrl);
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
            {
                outPoint: {
                    txHash: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.TX_HASH,
                    index: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.INDEX,
                },
                depType: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.DEP_TYPE,
            }
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
