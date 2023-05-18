import {generateAccountFromPrivateKey, signTransaction} from "./txService";
import {BI, commons, helpers, Indexer, Transaction} from "@ckb-lumos/lumos";
import {sudt} from "@ckb-lumos/common-scripts";
import {utils} from "@ckb-lumos/base";
import {BIish} from "@ckb-lumos/bi";
import {CKB_CONFIG, CKB_RPC_INDEX_URL, CKB_RPC_URL, RPCClient} from "../config/config";
import {FeeRate} from "./transfer";
import {Hash} from "@ckb-lumos/base/lib/primitive";


export async function issueToken(privateKey: string, amount: BIish): Promise<Transaction> {

    let acc = generateAccountFromPrivateKey(privateKey)

    let txSkeleton = helpers.TransactionSkeleton({
        cellProvider:
            new Indexer(CKB_RPC_INDEX_URL, CKB_RPC_URL)
    })

    txSkeleton = await sudt.issueToken(
        txSkeleton,
        acc.address,
        utils.toBigUInt128LE(amount), undefined, undefined,
        {
            config: CKB_CONFIG
        }
    );
    txSkeleton = await commons.common.payFee(txSkeleton, [acc.address], FeeRate.NORMAL)
    return signTransaction(txSkeleton, privateKey)
    // txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
    // const message = txSkeleton.get("signingEntries").get(0)?.message;
    // const Sig = hd.key.signRecoverable(message!, privateKey);
    // let tx1 = helpers.sealTransaction(txSkeleton, [Sig]);
    // return await rpc.sendTransaction(tx1, "passthrough");
}

export function getSUDTokenId(ckbAddress): Hash {
    return sudt.ownerForSudt(ckbAddress)
}

export async function transferUSDT(privateKey: string, SUDTTokenId: string, to: string, amount: BIish) {
    let acc = generateAccountFromPrivateKey(privateKey)

    let txSkeleton = helpers.TransactionSkeleton({
        cellProvider:
            new Indexer(CKB_RPC_INDEX_URL, CKB_RPC_URL)
    })

    txSkeleton = await sudt.transfer(
        txSkeleton,
        [acc.address],
        SUDTTokenId,
        to,
        utils.toBigUInt128LE(amount), undefined, undefined,
        undefined,
        {
            config: CKB_CONFIG
        }
    );
    txSkeleton = await commons.common.payFee(txSkeleton, [acc.address], FeeRate.NORMAL)
    return signTransaction(txSkeleton, privateKey)
}

export async function getSUDTBalance(sudtId:string,ckbAddress: string) {

    const cells = await RPCClient.getCells({
        script:helpers.addressToScript(ckbAddress),
        scriptType:"lock",
        filter:{
            script: {
                args: sudtId,
                codeHash: CKB_CONFIG.SCRIPTS.SUDT.CODE_HASH,
                hashType: CKB_CONFIG.SCRIPTS.SUDT.HASH_TYPE
            }
        }
    },"asc","0xfff")
    return cells.objects.reduce((accumulator, x) => {
        const bigUInt = utils.readBigUInt128LE(x.outputData);
        return BI.from(accumulator) .add( bigUInt);
    }, BI.from(0)).toBigInt();

}
