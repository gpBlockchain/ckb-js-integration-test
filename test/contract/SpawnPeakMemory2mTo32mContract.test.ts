import {
    SpawnPeakMemory2mTo32mContract,
} from "../../service/contract/SpawnPeakMemory2mTo32mContract";
import {ACCOUNT_PRIVATE_1, CKB_RPC_URL, RPCClient} from "../../config/config";
import {DeployType, getDeployScriptConfig} from "../../service/deploy";
import {request} from "../util/util";
import {encodeToAddress} from "@ckb-lumos/helpers";

describe('SpawnPeakMemory2mTo32mContract', function () {

    this.timeout(1000000)
    //0x2fc65ccd6b3bbb9d1e8fab3ee5d34b8426aed29092639918b650fb7f53282825

    it('deploy ', async () => {
        // const addr = generateAccountFromPrivateKey(ACCOUNT_PRIVATE_1);
        // console.log(addr.address)
        let spm2To32Contract = new SpawnPeakMemory2mTo32mContract(ACCOUNT_PRIVATE_1)
        await spm2To32Contract.deploy();
    });


    it("query msg", async () => {
        const ret = await getDeployScriptConfig("0x4a8dfbb8ef5555d7e6cac294b36ef00981f3157f9739c7e765a3fdd7a3de02ce", 0, DeployType.typeId)
        // console.log(ret)
        console.log(ret)
    })

    it("invoke", async () => {

        let spm2To32Contract = new SpawnPeakMemory2mTo32mContract(ACCOUNT_PRIVATE_1,
            {
                CODE_HASH: '0x8940546ff1227d329be5630f28dec79df60a5856b97a7e183a5bf1f15acec904',
                HASH_TYPE: 'type',
                TX_HASH: '0x49698a29eab679ed3c61f3dab43ea5539088c4dedef1291b5890c5c52675f54d',
                INDEX: '0x0',
                DEP_TYPE: 'code'
            },
        )
        let tx = await spm2To32Contract.buildTx();
        console.log('seal tx:', JSON.stringify(tx))
        // let txHash = await RPCClient.sendTransaction(tx,'passthrough')
        // console.log('tx hash:',txHash)
        // console.log(BI.from(ret.cycles).toNumber())

        const hash = await RPCClient.sendTransaction(tx,"passthrough")

        console.log("hash:",hash)
    })
});