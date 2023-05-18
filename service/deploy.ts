import {readFileSync} from "fs";
import {BI,Indexer, Transaction} from "@ckb-lumos/lumos";
import {deploy} from "@ckb-lumos/common-scripts";
import {CKB_CONFIG, CKB_RPC_INDEX_URL, RPCClient} from "../config/config";
import {CKB_RPC_URL} from "../config/config";
import {generateAccountFromPrivateKey, signTransaction} from "./txService";
import {utils} from "@ckb-lumos/base";
import {bytes} from "@ckb-lumos/codec";


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


export async function deployContractByPath( privateKey: string, path: string, deployType: DeployType): Promise<Transaction> {
    const contractBin = readFileSync(path);
    return await deployContractByArray( privateKey, contractBin, deployType)
}
export async function  deployContractByHexString(privateKey: string, hexCode: string, deployType: DeployType): Promise<Transaction> {
    const contractBin = hexToUint8Array(hexCode);
    return await deployContractByArray( privateKey, contractBin, deployType)
}


export async function deployContractByArray(privateKey: string, SCRIPTBINARY: Uint8Array, deployType: DeployType): Promise<Transaction> {
    let acc = generateAccountFromPrivateKey(privateKey)
    const indexer = new Indexer(CKB_RPC_INDEX_URL, CKB_RPC_URL);
    let deployResult;
    console.log('begin')
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
            console.log('begin 2 ')
            deployResult = await deploy.generateDeployWithTypeIdTx(
                {
                    cellProvider: indexer,
                    scriptBinary: SCRIPTBINARY,
                    fromInfo: acc.address,
                    config: CKB_CONFIG,
                }
            );
            console.log('begin 3 ')
            break
        default:
            throw new Error("not support")
    }
    let txSkeleton = deployResult.txSkeleton
    return signTransaction(txSkeleton, privateKey);
}

export async function getDeployScriptConfig(txHash: string, outputIndex: number, deployType: DeployType) {
    // todo get txHash
    // get
    const tx = await RPCClient.getTransaction(txHash)
    switch (deployType) {
        case DeployType.data:
            const data = tx.transaction.outputsData[outputIndex];
            let codeHash1 = utils.ckbHash(bytes.bytify(data));

            return {
                CODE_HASH: codeHash1,
                HASH_TYPE: "data",
                TX_HASH: txHash,
                INDEX: "0x0",
                DEP_TYPE: "code",
            };
            break;
        case DeployType.typeId:
            let codeHash = utils.computeScriptHash(tx.transaction.outputs[outputIndex].type);
            return {
                CODE_HASH: codeHash,
                HASH_TYPE: "type",
                TX_HASH: txHash,
                INDEX: BI.from(outputIndex).toHexString(),
                DEP_TYPE: "code",
            }
    }
    throw new Error("not support ")
}

function hexToUint8Array(hexInput:string) {
    let hex = hexInput.toString();  // 将输入转换为十六进制字符串
    console.log('hex:',hex)
    // 确保 hex 字符串的长度是偶数
    if (hex.length % 2 != 0) {
      hex = '0' + hex;
    }

    let bytes = [];

    for(let i = 0; i< hex.length; i+=2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }

    return new Uint8Array(bytes);
}
