import {RPC} from "@ckb-lumos/rpc";
import {config} from "@ckb-lumos/lumos";

export const ACCOUNT_PRIVATE_2 = "0x650e256211f5e0beee9084596aa2cb84d11eb033cced5e2d5b191593a9f9f1d4";
export const ACCOUNT_PRIVATE_1 ="0xdd50cac37ec6dd12539a968c1a2cbedda75bd8724f7bcad486548eaabb87fc8b"
// export const CKB_RPC_URL = "http://18.162.235.225:8114"

export const CKB_RPC_URL = "https://testnet.ckbapp.dev"
export const CKB_PRC_URL1 = "https://testnet.ckbapp.dev"
export const CKB_RPC_INDEX_URL = "https://testnet.ckbapp.dev"

// export const CKB_RPC_INDEX_URL = "http://18.162.235.225:8116"
export const RPC_DEBUG_SERVICE = false
export const RPCClient = new RPC(CKB_RPC_URL);
export const RPCClient1 = new RPC(CKB_RPC_URL);
export let CKB_CONFIG = config.predefined.AGGRON4
config.initializeConfig(config.predefined.AGGRON4)
//     config.createConfig({
//
//     PREFIX: "ckt",
//     SCRIPTS: {
//         SECP256K1_BLAKE160: {
//             CODE_HASH:
//                 "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
//             HASH_TYPE: "type",
//             TX_HASH:
//                 "0xd0726898772092537cec0b12953b36bc7d41cb6bcb7c8449c044fc0c08adb0fb",
//             INDEX: "0x0",
//             DEP_TYPE: "depGroup",
//             SHORT_ID: 0,
//         },
//         SECP256K1_BLAKE160_MULTISIG: {
//             CODE_HASH:
//                 "0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8",
//             HASH_TYPE: "type",
//             TX_HASH:
//                 "0xd0726898772092537cec0b12953b36bc7d41cb6bcb7c8449c044fc0c08adb0fb",
//             INDEX: "0x1",
//             DEP_TYPE: "depGroup",
//             SHORT_ID: 1,
//         },
//         DAO: {
//             CODE_HASH:
//                 "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
//             HASH_TYPE: "type",
//             TX_HASH:
//                 "0x8f8c79eb6671709633fe6a46de93c0fedc9c1b8a6527a18d3983879542635c9f",
//             INDEX: "0x2",
//             DEP_TYPE: "code",
//         },
//         SUDT: {
//             CODE_HASH:
//                 "0xc5e5dcf215925f7ef4dfaf5f4b4f105bc321c02776d6e7d52a1db3fcd9d011a4",
//             HASH_TYPE: "type",
//             TX_HASH:
//                 "0xe12877ebd2c3c364dc46c5c992bcfaf4fee33fa13eebdf82c591fc9825aab769",
//             INDEX: "0x0",
//             DEP_TYPE: "code",
//         },
//         ANYONE_CAN_PAY: {
//             CODE_HASH:
//                 "0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356",
//             HASH_TYPE: "type",
//             TX_HASH:
//                 "0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6",
//             INDEX: "0x0",
//             DEP_TYPE: "depGroup",
//             SHORT_ID: 2,
//         },
//         OMNILOCK: {
//             CODE_HASH:
//                 "0xf329effd1c475a2978453c8600e1eaf0bc2087ee093c3ee64cc96ec6847752cb",
//             HASH_TYPE: "type",
//             TX_HASH:
//                 "0x27b62d8be8ed80b9f56ee0fe41355becdb6f6a40aeba82d3900434f43b1c8b60",
//             INDEX: "0x0",
//             DEP_TYPE: "code",
//         },
//     },
// });


