import {request} from "../util/util";
import { CKB_RPC_URL} from "../../config/config";

export function getSearchKeyByMode(mode: "exact" | "prefix" | "other" | undefined, args = "0x") {
    if (mode == undefined) {
        return {
            "script": {
                "code_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
                "hash_type": "data",
                "args": args
            },
            "script_type": "lock",
            "with_data":false,
        }
    }
    return {
        "script": {
            "code_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "hash_type": "data",
            "args": args
        },
        "script_type": "lock",
        "script_search_mode": mode,
        "with_data":false,

    }
}

export async function get_cells(search: any, order: "asc" | "desc", limit: string, after_cursor: string | undefined): Promise<any> {
    return await request(1, CKB_RPC_URL, "get_cells", [search, order, limit, after_cursor]);
}
export async function get_transactions(search: any, order: "asc" | "desc", limit: string, after_cursor: string | undefined): Promise<any> {
    return await request(1, CKB_RPC_URL, "get_transactions", [search, order, limit, after_cursor]);
}

export async function get_cells_capacity(search: any): Promise<any> {
    return await request(1, CKB_RPC_URL, "get_cells_capacity", [search]);
}


