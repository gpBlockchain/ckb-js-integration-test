import {Cell, commons, CellDep, helpers, Indexer, BI,  Transaction} from "@ckb-lumos/lumos";
import {values} from "@ckb-lumos/base"

import {CKB_CONFIG, CKB_RPC_INDEX_URL, CKB_RPC_URL} from "../config/config";
import {signTransaction} from "./txService";


export enum FeeRate {
    SLOW = 508,
    NORMAL = 6847934,
    FAST = 10000000
}

interface TransferOpts {
    from: string;
    to: string;
    amount: string;
    privKey: string;
    feeRate: FeeRate;
}

export interface buildTransferOpt {
    from: string;
    outputCells: Cell[];
    inputCells?: Cell[];
    deps?: CellDep[];
}

export async function transfer(transferOpts: TransferOpts): Promise<Transaction> {
    let txSkeleton = helpers.TransactionSkeleton({cellProvider: new Indexer(CKB_RPC_INDEX_URL, CKB_RPC_URL)});
    txSkeleton = await commons.common.transfer(
        txSkeleton,
        [transferOpts.from],
        transferOpts.to,
        BI.from(transferOpts.amount).toNumber(),
        undefined,
        undefined,
        {config: CKB_CONFIG}
    );

    // https://github.com/nervosnetwork/ckb/blob/develop/util/app-config/src/legacy/tx_pool.rs#L9
    // const DEFAULT_MIN_FEE_RATE: FeeRate = FeeRate::from_u64(1000);
    txSkeleton = await commons.common.payFeeByFeeRate(
        txSkeleton,
        [transferOpts.from],
        transferOpts.feeRate, /*fee_rate*/
        undefined,
        {config: CKB_CONFIG}
    );
    return signTransaction(txSkeleton, transferOpts.privKey)
}


export async function getCkbBalance(ckbAddress: string): Promise<BigInt> {

    const defaultIndexer = new Indexer(CKB_RPC_INDEX_URL, CKB_RPC_URL);
    const collector = defaultIndexer.collector({lock: helpers.parseAddress(ckbAddress), type: "empty"});
    let collectedSum = BI.from(0)
    for await (const cell of collector.collect()) {
        collectedSum = collectedSum.add(cell.cellOutput.capacity);
        console.log("collectedSum:", collectedSum.toNumber())
    }
    return collectedSum.toBigInt()
}