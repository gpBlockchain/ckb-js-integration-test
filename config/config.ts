import {RPC} from "@ckb-lumos/rpc";
import {config} from "@ckb-lumos/lumos";
export const ACCOUNT_PRIVATE_1 = "0xdd50cac37ec6dd12539a968c1a2cbedda75bd8724f7bcad486548eaabb87fc8b";
export const CKB_RPC_URL = "https://testnet.ckbapp.dev/"
export const CKB_PRC_URL1 = "https://testnet.ckbapp.dev/"
export const RPC_DEBUG_SERVICE= false
export const RPCClient = new RPC(CKB_RPC_URL);
export const RPCClient1 = new RPC(CKB_RPC_URL);
export let CKB_CONFIG = config.predefined.AGGRON4
