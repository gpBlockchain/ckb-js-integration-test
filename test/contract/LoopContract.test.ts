import {ARG_CPU, LoopContract} from "../../service/contract/LoopContract";
import {ACCOUNT_PRIVATE_1, ACCOUNT_PRIVATE_3, CKB_RPC_URL, RPCClient, RPCClient1} from "../../config/config";
import {DeployType, getDeployScriptConfig, ScriptConfig} from "../../service/deploy";
import {estimate_cycles, generateAccountFromPrivateKey, signTransaction} from "../../service/txService";
import {BI, Cell, helpers} from "@ckb-lumos/lumos";
import {request, Sleep} from "../util/util";
import {CKBComponents} from "@ckb-lumos/rpc/lib/types/api";
import CellStatus = CKBComponents.CellStatus;

const current_deploy_config: ScriptConfig = {
    CODE_HASH: '0x64b5c3a8bc7aa8058eb0bc44b03de54d4108839069213ed55107a3ab62e02533',
    HASH_TYPE: 'type',
    TX_HASH: '0x84809cb24ebe5c91ee9e3049ef7e0e6b7f282fcc7bceb05d4722117f5a538663',
    INDEX: '0x0',
    DEP_TYPE: 'code'
}


describe('LoopContract', function () {

    this.timeout(10000000000)
    it('deploy', async () => {
        const loopContract = new LoopContract(ACCOUNT_PRIVATE_1)
        await loopContract.deploy()

    });

    it("get block has", async () => {
        const block = await RPCClient.getBlockByNumber("0x0")
        console.log(block.transactions[1].hash)
    })

    it("assas", async () => {


    })


    it("test", async () => {
        const addr = generateAccountFromPrivateKey("0xdd50cac37ec6dd12539a968c1a2cbedda75bd8724f7bcad486548eaabb87fc8b")
        console.log(addr)
    })

    it("query tx", async () => {
        let txs = (await RPCClient.getRawTxPool()).pending
        for (let i = 0; i < txs.length; i++) {
            const ret = await RPCClient.getTransaction(txs[i])
            const preRet = await RPCClient.getTransaction(ret.transaction.inputs[0].previousOutput.txHash)

            console.log(`tx:${txs[i]},status:${ret.txStatus.status}, pre hash:${preRet.transaction.hash},status:${preRet.txStatus.status}`)
        }

    })
    it("get deploy msg", async () => {
        let code = await getDeployScriptConfig("0xc03af747e47e3216d9d1f72d82c261943b882552f04c00c02e007a60b64a589e", 0, DeployType.data)
        console.log(code)
    })

    it("get tip", async () => {
        const tip = await RPCClient.getTipHeader()
        console.log(BI.from(tip.number).toNumber())
    })

    it("get hash", async () => {
        const header = await RPCClient.getBlockByNumber(BI.from("175233").toHexString())
        console.log(JSON.stringify(header))
    })
    // {"header":{"compactTarget":"0x19e67400","parentHash":"0xcf4a713be743903dbf75e2cc354dc3c9fd2a8080d8a7ee7d316890ca458d21d9","transactionsRoot":"0xb4a5bcb01b97d602a74075ccd14644ebf5ddbd15914acdc7a5271b8e8ec6275e","proposalsHash":"0x0000000000000000000000000000000000000000000000000000000000000000","extraHash":"0x165e1dde2dea7d8edc651c93202e23de9ba044093b508f1c9b6eac93fb15976b","dao":"0xe718d7af81c51d3f275e446310952300e4eec04650d7120000d6696acec20307","epoch":"0x7080136000063","hash":"0x7003bf69c7ee8c6d049c50fb40daed9818cc18bbbd1d7db3b9348a4caa5c0724","nonce":"0x65212f6aee1b9d209c86ca991d3f7011","number":"0x2ac81","timestamp":"0x1887b477377","version":"0x0"},"uncles":[],"transactions":[{"cellDeps":[],"inputs":[{"previousOutput":{"txHash":"0x0000000000000000000000000000000000000000000000000000000000000000","index":"0xffffffff"},"since":"0x2ac81"}],"outputs":[{"lock":{"codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hashType":"type","args":"0x43d509d97f26007a285f39241cffcd411157196c"},"type":null,"capacity":"0x606747bf576"}],"outputsData":["0x"],"headerDeps":[],"hash":"0x45c103fe4cad4adae00f7042e784de75410c9afbbfc8c336bdb15b45a9e8365a","version":"0x0","witnesses":["0x7e0000000c00000055000000490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8011400000043d509d97f26007a285f39241cffcd411157196c250000000000000020302e3131312e302d70726520286532643863383720323032332d30362d303129"]}],"extension":"0xb13014192054b49972c2d2f963df475b4b208d5522235d8d984be7747d689d1d","proposals":[]}
    // {"header":{"compactTarget":"0x19e67400","parentHash":"0xcf4a713be743903dbf75e2cc354dc3c9fd2a8080d8a7ee7d316890ca458d21d9","transactionsRoot":"0xb4a5bcb01b97d602a74075ccd14644ebf5ddbd15914acdc7a5271b8e8ec6275e","proposalsHash":"0x0000000000000000000000000000000000000000000000000000000000000000","extraHash":"0x165e1dde2dea7d8edc651c93202e23de9ba044093b508f1c9b6eac93fb15976b","dao":"0xe718d7af81c51d3f275e446310952300e4eec04650d7120000d6696acec20307","epoch":"0x7080136000063","hash":"0x7003bf69c7ee8c6d049c50fb40daed9818cc18bbbd1d7db3b9348a4caa5c0724","nonce":"0x65212f6aee1b9d209c86ca991d3f7011","number":"0x2ac81","timestamp":"0x1887b477377","version":"0x0"},"uncles":[],"transactions":[{"cellDeps":[],"inputs":[{"previousOutput":{"txHash":"0x0000000000000000000000000000000000000000000000000000000000000000","index":"0xffffffff"},"since":"0x2ac81"}],"outputs":[{"lock":{"codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hashType":"type","args":"0x43d509d97f26007a285f39241cffcd411157196c"},"type":null,"capacity":"0x606747bf576"}],"outputsData":["0x"],"headerDeps":[],"hash":"0x45c103fe4cad4adae00f7042e784de75410c9afbbfc8c336bdb15b45a9e8365a","version":"0x0","witnesses":["0x7e0000000c00000055000000490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8011400000043d509d97f26007a285f39241cffcd411157196c250000000000000020302e3131312e302d70726520286532643863383720323032332d30362d303129"]}],"extension":"0xb13014192054b49972c2d2f963df475b4b208d5522235d8d984be7747d689d1d","proposals":[]}


    it("get pool 3", async () => {
        for (let i = 0; i < 10000000; i++) {
            const pool = await RPCClient.getRawTxPool()
            console.log(`pending:${pool.pending.length},proposed:${pool.proposed.length}`)
            pool.pending.forEach(tx => console.log(tx))
            pool.proposed.forEach(tx => console.log(tx))

            await Sleep(1000)
        }
    })
    it("get tip 1", async () => {
        const rr = await RPCClient.getTipHeader()
        console.log(rr)
    })
    it('should invoke', async () => {
        const loopContract = new LoopContract(ACCOUNT_PRIVATE_1, current_deploy_config)

        const txMsg = await loopContract.buildTx(1, ARG_CPU)
        let tx = signTransaction(txMsg, ACCOUNT_PRIVATE_1)
        for (let i = 0; i < 100; i++) {
            try {
                const ret = await estimate_cycles(CKB_RPC_URL, tx)
                console.log(JSON.stringify(tx))
                console.log(BI.from(ret.cycles).toNumber())
            } catch (e) {
            }
        }

    });
    it('invoke mem', async () => {
        const loopContract = new LoopContract(ACCOUNT_PRIVATE_1, current_deploy_config)

        const txMsg = await loopContract.buildTx(1000000000, ARG_CPU)
        let tx = signTransaction(txMsg, ACCOUNT_PRIVATE_1)
        const ret = await RPCClient.sendTransaction(tx)
        console.log(ret)

    })

    it("slle 1", async () => {
        await Sleep(1000)
        console.log('dd')
    })
    it("query pool", async () => {
        const ret = await request(1, "http://18.162.180.86:8120", "tx_pool_info")
        console.log(ret)
    })

    it("get tip of ", async () => {

        console.log(BI.from((await RPCClient.getTipHeader()).number).toBigInt())

    })
    it("get tx info ", async () => {
        let script = helpers.parseAddress("ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqvgswj39m3rs0qp2a9r9rmqamxtkntcysqpa4a8l")
        let scrpt2 = helpers.parseAddress("ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqwgx292hnvmn68xf779vmzrshpmm6epn4g6eqkaw")
        console.log("script1:", script)
        console.log("script2:", scrpt2)
    })


    it("get tx", async () => {
        let tx = await RPCClient.getTransaction("0x85170c9093b87b83d23bdb4e8b0a8fc8545464b3bd6d7808c4e3a836614a779e")
        // console.log(tx)
        console.log(tx.txStatus)
    })


    it("sasd", async () => {
        let block = await RPCClient.getBlock("0x9584b9de0e1a3c67accd3337568b4dbd3a5eda4b565115dd9f617ab43adf5ad9")
        console.log(block)
    })

    it('invoke cycle 2 ', async () => {

        let account = generateAccountFromPrivateKey(ACCOUNT_PRIVATE_1)
        //
        const cells = await RPCClient.getCells({
                script: account.lockScript,
                scriptType: "lock"
            }, "asc", "0xfff"
        )
        console.log(cells.objects.length)
        let invokes = []
        for (let i = 0; i < 5; i++) {
            console.log(JSON.stringify(cells.objects[i]))
            let invoke = invokeWithCount([{
                cellOutput: cells.objects[i].output,
                data: cells.objects[i].outputData,
                outPoint: cells.objects[i].outPoint
            }], ACCOUNT_PRIVATE_1, 10000)
            invokes.push(invoke)
        }
        for (let i = 0; i < invokes.length; i++) {
            await invokes[i]
        }


    });


});

async function invokeWithCount(inputs: Cell[], accountPrivate: string, number: number) {

    for (let i = 0; i < number; i++) {
        const hash = await invokeWithInput(inputs, accountPrivate)
        inputs = await getInputCellByTx(hash, 0)
    }

}

async function invokeWithInput(inputs: Cell[], accountPrivate: string): Promise<string> {
    const loopContract = new LoopContract(accountPrivate, current_deploy_config)
    const txMsg = await loopContract.buildTxWithInput(40000000, ARG_CPU, inputs)
    let tx = signTransaction(txMsg, accountPrivate)
    console.log(JSON.stringify(tx))
    for (let i = 0; i < 1000; i++) {
        try {
            const hash = await RPCClient.sendTransaction(tx, "passthrough")
            console.log('send tx hash:', hash)
            return hash;
        } catch (e) {
            console.log(e)
            console.log("sleep 1s again")
            await Sleep(1)
        }
    }

}

async function getInputCellByTx(txHash: string, idx: number, noCheck = true): Promise<Cell[]> {

    const tx = await RPCClient.getTransaction(txHash)
    if (noCheck) {
        return [{
            cellOutput: tx.transaction.outputs[idx],
            data: tx.transaction.outputsData[idx],
            outPoint: {
                txHash: txHash,
                index: BI.from(idx).toHexString()
            }
        }]
    }
    for (let i = 0; i < 1000; i++) {
        const ret = await RPCClient.getLiveCell({
            txHash: txHash,
            index: BI.from(idx).toHexString()
        }, false)
        if (ret.status === CellStatus.Live) {
            return [{
                cellOutput: tx.transaction.outputs[idx],
                data: tx.transaction.outputsData[idx],
                outPoint: {
                    txHash: txHash,
                    index: BI.from(idx).toHexString()
                }

            }]
        }
        const tx1 = await RPCClient.getTransaction(txHash)
        console.log(`txHash:${txHash},tx status:${tx1.txStatus.status},cell status:${ret.status}`,)
        await Sleep(50)
    }
    throw new Error(`get live failed :${txHash}`)

}