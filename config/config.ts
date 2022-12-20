import {RPC} from "@ckb-lumos/rpc";

export const CKB_RPC_URL = "https://testnet.ckb.dev/"
export const RPC_DEBUG_SERVICE= true
export const RPCClient = new RPC(CKB_RPC_URL);
