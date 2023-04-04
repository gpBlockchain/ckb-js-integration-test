import {readFileSync} from "fs";
import {commons, hd, helpers, Indexer} from "@ckb-lumos/lumos";
import {deploy} from "@ckb-lumos/common-scripts";
import {CKB_CONFIG} from "../config/config";
import {CKB_RPC_URL} from "../config/config";
import {generateAccountFromPrivateKey} from "./txService";
import {RPC} from "@ckb-lumos/rpc";


export enum DeployType {
    data,
    typeId,
}

export interface ScriptConfig {
    // if hash_type is type, code_hash is ckbHash(type_script)
    // if hash_type is data, code_hash is ckbHash(data)
    CODE_HASH: string;

    HASH_TYPE: "type" | "data" | "data1";

    TX_HASH: string;
    // the deploy cell can be found at index of tx's outputs
    INDEX: string;

    // now deployWithX only supportted `code `
    DEP_TYPE: "dep_group" | "code";

    // empty
    SHORT_ID?: number;
}


export async function deployContractByPath(ckbRpcUrl: string, privateKey: string, path: string, deployType: DeployType): Promise<ScriptConfig> {
    const contractBin = readFileSync(path);
    return await deployContractByArray(ckbRpcUrl, privateKey, contractBin, deployType)
}


export async function deployContractByArray(ckbRpcUrl: string, privateKey: string, SCRIPTBINARY: Uint8Array, deployType: DeployType): Promise<ScriptConfig> {
    let acc = generateAccountFromPrivateKey(privateKey)
    const indexer = new Indexer(ckbRpcUrl, ckbRpcUrl);
    const RPCClient = new RPC(CKB_RPC_URL);
    let deployResult;
    switch (deployType) {
        case DeployType.data:
            deployResult = await deploy.generateDeployWithDataTx(
                {
                    cellProvider: indexer,
                    scriptBinary: SCRIPTBINARY,
                    fromInfo: acc.address,
                    config: CKB_CONFIG,
                }
            );
            break
        case DeployType.typeId:
            deployResult = await deploy.generateDeployWithTypeIdTx(
                {
                    cellProvider: indexer,
                    scriptBinary: SCRIPTBINARY,
                    fromInfo: acc.address,
                    config: CKB_CONFIG,
                }
            );
            break
        default:
            throw new Error("not support")
    }
    let txSkeleton = deployResult.txSkeleton
    txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
    txSkeleton = txSkeleton.update("cellDeps", (cellDeps) => cellDeps.remove(0))
    txSkeleton = txSkeleton.update("cellDeps", (cellDeps) => cellDeps.remove(0))
    txSkeleton = txSkeleton.update("cellDeps", (cellDeps) =>
        cellDeps.push(...[
            {
                outPoint: {
                    txHash: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.TX_HASH,
                    index: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.INDEX,
                },
                depType: CKB_CONFIG.SCRIPTS.SECP256K1_BLAKE160.DEP_TYPE,
            }])
    );
    const message = txSkeleton.get("signingEntries").get(0)?.message;
    const Sig = hd.key.signRecoverable(message!, privateKey);
    let tx1 =  helpers.sealTransaction(txSkeleton, [Sig]);
    console.log("tx1:", JSON.stringify(tx1))
    // let tx = await RPCClient.sendTransaction(tx1, "passthrough");
    // console.log('tx:', tx)
    return deployResult.scriptConfig
}
