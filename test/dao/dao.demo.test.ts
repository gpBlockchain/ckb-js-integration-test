import {Cell, commons, config, hd, Indexer, OutPoint, RPC} from "@ckb-lumos/lumos";
import {ACCOUNT_PRIVATE_2, CKB_CONFIG, CKB_RPC_INDEX_URL, CKB_RPC_URL, RPCClient} from "../../config/config";
import {encodeToAddress, sealTransaction, TransactionSkeleton, TransactionSkeletonType} from "@ckb-lumos/helpers";
import {Account, generateAccountFromPrivateKey} from "../../service/txService";
import {CKBRPC} from "@ckb-lumos/rpc";
import {BI} from "@ckb-lumos/bi";
import {parseSince} from "@ckb-lumos/base/lib/since";
import {DeployType, getDeployScriptConfig} from "../../service/deploy";
import {withdraw} from "@ckb-lumos/common-scripts/lib/anyone_can_pay";

const DAOScript = {
    CODE_HASH: '0x32064a14ce10d95d4b7343054cc19d73b25b16ae61a6c681011ca781a60c7923',
    HASH_TYPE: 'data1',
    TX_HASH: '0x700867a5e09eebdedecaa0437455e54d99f9c6752adad1fd299bd6ede303f46d',
    INDEX: '0x0',
    DEP_TYPE: 'code'
}

describe('dao', function () {

    this.timeout(10000000)
    let RPCClient: CKBRPC;
    let account: Account;
    beforeEach(async () => {
        account = generateAccountFromPrivateKey(ACCOUNT_PRIVATE_2)

        RPCClient = new RPC(CKB_RPC_URL);
        await initConfig(RPCClient)
    })

    it("deposit", async () => {
        let fromAddress = account.address;
        let txSkeleton = TransactionSkeleton({cellProvider: new Indexer(CKB_RPC_INDEX_URL, CKB_RPC_URL)});
        txSkeleton = await commons.dao.deposit(
            txSkeleton,
            fromAddress,
            fromAddress,
            BigInt(1050 * 10 ** 8)
        );
        // txSkeleton = changeNervosDao(txSkeleton)
        txSkeleton = await commons.common.payFeeByFeeRate(txSkeleton, [fromAddress],
            1000,
        )
        txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
        const message = txSkeleton.get("signingEntries").get(0)?.message;
        const Sig = hd.key.signRecoverable(message!, ACCOUNT_PRIVATE_2);
        const tx = sealTransaction(txSkeleton, [Sig]);
        console.log(JSON.stringify(tx))
        const hash = await RPCClient.sendTransaction(tx, "passthrough");
        console.log('deposit succ, hash:', hash)

    })

    it("withdraw 1,arg length eq", async () => {
        let txSkeleton = TransactionSkeleton({cellProvider: new Indexer(CKB_RPC_INDEX_URL, CKB_RPC_URL)});
        let daoCells = await getDaoCells(account.address, "deposit");
        console.log("dao cells:", daoCells)

        txSkeleton = await commons.dao.withdraw(
            txSkeleton,
            daoCells[0],
            account.address
        );

        // txSkeleton = changeNervosDao(txSkeleton)
        txSkeleton = await commons.common.payFeeByFeeRate(
            txSkeleton,
            [account.address],
            10000,
        );

        // sign tx
        txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
        const message = txSkeleton.get("signingEntries").get(0)?.message;
        const Sig = hd.key.signRecoverable(message!, ACCOUNT_PRIVATE_2);
        const tx = sealTransaction(txSkeleton, [Sig]);
        console.log(JSON.stringify(tx))


        // estimateCycles transaction
        // @ts-ignore
        const cycle = await RPCClient.estimateCycles(tx);
        console.log("could send succ, cycle:", cycle)

        //send tx
        // const txHash = await RPCClient.sendTransaction(tx,"passthrough");
        // console.log(" send succ, txHash:",txHash)

    })

    it("withdraw 1 ,arg length not eq", async () => {
        let CHANGE_ARG = "0x12"

        let txSkeleton = TransactionSkeleton({cellProvider: new Indexer(CKB_RPC_INDEX_URL, CKB_RPC_URL)});
        let daoCells = await getDaoCells(account.address, "deposit");
        console.log("dao cells:", daoCells)

        txSkeleton = await commons.dao.withdraw(
            txSkeleton,
            daoCells[0],
            account.address
        );

        // txSkeleton = changeNervosDao(txSkeleton)
        txSkeleton = await commons.common.payFeeByFeeRate(
            txSkeleton,
            [account.address],
            10000,
        );


        // args length change
        let outputs = txSkeleton.get("outputs");
        let cell = outputs.get(0)
        cell.cellOutput.lock.args = CHANGE_ARG
        outputs.set(0, cell)
        txSkeleton = txSkeleton.update("outputs", (outputs) => outputs.set(0, cell));

        // sign tx
        txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
        const message = txSkeleton.get("signingEntries").get(0)?.message;
        const Sig = hd.key.signRecoverable(message!, ACCOUNT_PRIVATE_2);
        const tx = sealTransaction(txSkeleton, [Sig]);
        console.log(JSON.stringify(tx))

        // estimateCycles transaction
        // @ts-ignore
        // const cycle = await RPCClient.estimateCycles(tx);
        // console.log("could send succ, cycle:", cycle)

        // send transaction
        const hash = await RPCClient.sendTransaction(tx, "passthrough");
    })




    it.skip("withdraw 2", async () => {
        let txSkeleton = TransactionSkeleton({cellProvider: new Indexer(CKB_RPC_INDEX_URL, CKB_RPC_URL)});
        let cells = await getDaoCells(account.address, "withdraw")
        console.log("cell:", cells[0])

        async function getDepositCellByWithDarwCellOputPoint(outPoint: OutPoint) {
            let transaction = await RPCClient.getTransaction(outPoint.txHash)
            return await getCellByOutPoint({
                txHash: transaction.transaction.inputs[0].previousOutput.txHash,
                index: transaction.transaction.inputs[0].previousOutput.index
            });
        }

        let depositCell = await getDepositCellByWithDarwCellOputPoint(cells[0].outPoint)
        txSkeleton = await commons.dao.unlock(txSkeleton, depositCell, cells[0], account.address, account.address)
        txSkeleton = await commons.common.payFeeByFeeRate(
            txSkeleton,
            [account.address],
            5000,
        );

        // let outputs = txSkeleton.get("outputs");
        // for (let i = 0; i < outputs.size; i++) {
        //     let cell = outputs.get(i)
        //     console.log(cell)
        //     cell.cellOutput.lock.args = "0xc8328aabcd9b9e8e64fbc566c4385c3bdeb219d7c8328aabcd9b9e8e64fbc566c4385c3bdeb219d7"
        //     txSkeleton = txSkeleton.update("outputs", (outputs) => outputs.set(i, cell));
        // }
        let output = txSkeleton.get("outputs").get(0)
        let input = txSkeleton.get("inputs").get(0)
        console.log(output.cellOutput.capacity)
        output.cellOutput.capacity = BI.from(input.cellOutput.capacity).add(BI.from(1)).toHexString()
        txSkeleton.update("outputs", (outputs) => outputs.set(0, output));

        txSkeleton = commons.common.prepareSigningEntries(txSkeleton);

        const message = txSkeleton.get("signingEntries").get(0)?.message;
        const Sig = hd.key.signRecoverable(message!, ACCOUNT_PRIVATE_2);

        const tx = sealTransaction(txSkeleton, [Sig]);
        let inputCells = [];
        for (let i = 0; i < tx.inputs.length; i++) {
            let cell = await getCellByOutPoint(tx.inputs[i].previousOutput)
            inputCells.push(cell)
        }
        console.log("----- from ------")
        for (let i = 0; i < inputCells.length; i++) {
            inputCells[i].cellOutput.type
            console.log(`address:${inputCells[i].cellOutput.lock.args},type:${inputCells[i].cellOutput.type?.args},since:${inputCells[i].since},cap:${BI.from(inputCells[i].cellOutput.capacity).toNumber()}`)
        }
        console.log("----- to ------")
        for (let i = 0; i < tx.outputs.length; i++) {
            console.log(`address:${tx.outputs[i].lock.args},cap:${BI.from(tx.outputs[i].capacity).toNumber()}`)
        }

        console.log(JSON.stringify(tx))
        const hash = await RPCClient.sendTransaction(tx, "passthrough");
        console.log('hash:', hash)
    })

    it.skip("query 1", async () => {
            let cells = commons.dao.listDaoCells(new Indexer(CKB_RPC_INDEX_URL, CKB_RPC_URL), account.address, "deposit")
            while (true) {
                let dd = await cells.next()
                console.log(dd)
                if (dd.value == undefined) {
                    return
                }
            }

        }
    )

});

async function getDaoCells(ckbAddress: string, cellType: "all" | "deposit" | "withdraw"): Promise<Cell[]> {
    let cellsList = []
    let cells = commons.dao.listDaoCells(new Indexer(CKB_RPC_INDEX_URL, CKB_RPC_URL), ckbAddress, cellType)
    while (true) {
        let dd = await cells.next()
        if (dd.value == undefined) {
            break
        }
        dd.value.blockHash = await RPCClient.getBlockHash(dd.value.blockNumber)
        cellsList.push(dd.value)
    }

    return cellsList;
}

export const getCellByOutPoint = async (outpoint: OutPoint): Promise<Cell> => {
    const tx = await RPCClient.getTransaction(outpoint.txHash);
    if (!tx) {
        throw new Error(`not found tx: ${outpoint.txHash}`)
    }
    console.log('getCellByOutPoint')
    const block = await RPCClient.getBlock(tx.txStatus.blockHash!);
    return {
        cellOutput: tx.transaction.outputs[BI.from(outpoint.index).toNumber()],
        data: tx.transaction.outputsData[BI.from(outpoint.index).toNumber()],
        outPoint: outpoint,
        blockHash: tx.txStatus.blockHash,
        blockNumber: block!.header.number,
    }
}

function changeNervosDao(tx: TransactionSkeletonType) {
    let outputs = tx.get("outputs")
    for (let i = 0; i < outputs.size; i++) {
        let output = outputs.get(i);
        if (output.cellOutput.type?.codeHash == CKB_CONFIG.SCRIPTS.DAO.CODE_HASH) {
            output.cellOutput.type.codeHash = "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e";
            output.cellOutput.type.hashType = "type";
            tx = tx.update("outputs", (outputs) => outputs.set(i, output));
        }
    }
    return tx;
}

async function initConfig(rpc: RPC) {
    let block = await RPCClient.getBlockByNumber("0x0")
    console.log(block.transactions[0].hash)
    console.log(block.transactions[1].hash)
    let SECP256K1_BLAKE160_HASH = block.transactions[1].hash
    let DAO_HASH = block.transactions[0].hash
    config.initializeConfig(
        config.createConfig({

            PREFIX: "ckt",
            SCRIPTS: {
                SECP256K1_BLAKE160: {
                    CODE_HASH:
                        "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    HASH_TYPE: "type",
                    TX_HASH: SECP256K1_BLAKE160_HASH,
                    INDEX: "0x0",
                    DEP_TYPE: "depGroup",
                    SHORT_ID: 0,
                },
                SECP256K1_BLAKE160_MULTISIG: {
                    CODE_HASH:
                        "0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8",
                    HASH_TYPE: "type",
                    TX_HASH: SECP256K1_BLAKE160_HASH,
                    INDEX: "0x1",
                    DEP_TYPE: "depGroup",
                    SHORT_ID: 1,
                },
                DAO: {
                    CODE_HASH:
                        "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    HASH_TYPE: "type",
                    TX_HASH:
                    DAO_HASH,
                    INDEX: "0x2",
                    DEP_TYPE: "code",
                },
                SUDT: {
                    CODE_HASH:
                        "0xc5e5dcf215925f7ef4dfaf5f4b4f105bc321c02776d6e7d52a1db3fcd9d011a4",
                    HASH_TYPE: "type",
                    TX_HASH:
                        "0xe12877ebd2c3c364dc46c5c992bcfaf4fee33fa13eebdf82c591fc9825aab769",
                    INDEX: "0x0",
                    DEP_TYPE: "code",
                },
                ANYONE_CAN_PAY: {
                    CODE_HASH:
                        "0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356",
                    HASH_TYPE: "type",
                    TX_HASH:
                        "0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6",
                    INDEX: "0x0",
                    DEP_TYPE: "depGroup",
                    SHORT_ID: 2,
                },
                OMNILOCK: {
                    CODE_HASH:
                        "0xf329effd1c475a2978453c8600e1eaf0bc2087ee093c3ee64cc96ec6847752cb",
                    HASH_TYPE: "type",
                    TX_HASH:
                        "0x27b62d8be8ed80b9f56ee0fe41355becdb6f6a40aeba82d3900434f43b1c8b60",
                    INDEX: "0x0",
                    DEP_TYPE: "code",
                },
            },
        })
    )
}