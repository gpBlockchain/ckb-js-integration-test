import {Cell, commons, hd, helpers, Transaction} from "@ckb-lumos/lumos";
import {TransactionSkeletonType} from "@ckb-lumos/helpers";
import {CellDep} from "@ckb-lumos/base/lib/api";
import {Hash, HexString} from "@ckb-lumos/base/lib/primitive";

export interface AddTransactionMsg {
    cellDeps?: CellDep[];
    headerDeps?: Hash[];
    inputs?: Cell[];
    outputs?: Cell[];
    witnesses?: HexString[];
}

export class TxBuild {

    tx: TransactionSkeletonType

    constructor() {
        this.tx = helpers.TransactionSkeleton({});
    }

    addInputs(input1: Cell[]): TxBuild {
        this.tx = this.tx.update("inputs", (inputs) => inputs.push(...input1));
        return this
    }

    addCellDeps(deps: CellDep[]): TxBuild {
        this.tx = this.tx.update("cellDeps", (inputs) => inputs.push(...deps));
        return this
    }

    addOutPoints(outputs1: Cell[]): TxBuild {
        this.tx = this.tx.update("outputs", (outputs) => outputs.push(...outputs1));
        return this
    }

    addWitnesses(witnesses1: HexString[]): TxBuild {
        this.tx = this.tx.update("witnesses", (witnesses) => witnesses.push(...witnesses1));
        return this
    }

    sign(privKey: string): Transaction {
        let txSkeleton = commons.common.prepareSigningEntries(this.tx);
        const message = txSkeleton.get("signingEntries").get(0)?.message;
        const Sig = hd.key.signRecoverable(message!, privKey);
        return helpers.sealTransaction(txSkeleton, [Sig]);
    }

}