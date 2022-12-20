import {CKB_RPC_URL, RPCClient} from "../../config/config";
import {request} from "../util/util";
import {formatter as paramsFmts} from "@ckb-lumos/rpc/lib/paramsFormatter";
import {RPC} from "@ckb-lumos/rpc/lib/types/rpc";
import Cell = RPC.Cell;
import {RawTransaction} from "@ckb-lumos/base/lib/api";
import {CKBComponents} from "@ckb-lumos/rpc/lib/types/api";
import {expect} from "chai";

describe('estimate_cycles', function () {

    it("dd",async ()=>{
        // await
    })
    it("normal tx", async () => {

        // get tx input
        // get tx output

        //   //  cellDeps: CellDep[];
        //     //     hash?: Hash;
        //     //     headerDeps: Hash[];
        //     //     inputs: Input[];
        //     //     outputs: Output[];
        //     //     outputsData: HexString[];
        //     //     version: HexString;

        let response = await estimate_cycles({
            inputs: [],
            outputs: [],
            cellDeps:[], headerDeps: [], outputsData: [], version: "0x0", witnesses: []
        })
        expect(response.cycles).to.be.equal("0x0")
    })

});
type CyclesResponse={
    cycles:string;
}

export async function estimate_cycles(tx: CKBComponents.RawTransaction) :Promise<CyclesResponse>{
    const res = await request(1, CKB_RPC_URL, "estimate_cycles", [
        paramsFmts.toRawTransaction(tx)
    ]);
    return {
        cycles:res.cycles
    };
}

// async function getDep() :Promise<Cell> {
//
// }



// async function getInputCell() :Promise<Cell>{
//
//
// }

// async function getOutPutCell() Promise<Dep>{
//
// }
