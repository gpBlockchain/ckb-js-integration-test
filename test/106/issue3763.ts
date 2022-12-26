import {RPCClient} from "../../config/config";
import {expect} from "chai";
import {BI} from "@ckb-lumos/lumos";
//https://github.com/nervosnetwork/ckb/pull/3763
describe('106', function () {

    this.timeout(1000*100000)
    let existTx;
    let notCellBaseTx;

    before(async ()=>{
        let tip = await RPCClient.getTipHeader()
        for (let i = 0; i < 100; i++) {
            let blk = await RPCClient.getBlockByNumber(BI.from(tip.number).sub(i).toHexString())
            if(blk.transactions.length>1){
                existTx = blk.transactions[0].hash
                notCellBaseTx = blk.transactions[1].hash
                break
            }
            console.log("num:",blk.header.number," transaction length:",blk.transactions.length)
        }
        console.log("tx:",existTx)
    })
    it("issue-3763,block tx >2 ,cell base tx => cycle == null",async ()=>{

        const tx = await RPCClient.getTransaction(existTx)
        console.log("tx:",tx)
        // @ts-ignore
        expect(tx.cycles).to.be.equal(null)
    })

    it("issue-3763,not cell base tx ",async ()=>{
        const tx = await RPCClient.getTransaction(notCellBaseTx)
        // @ts-ignore
        expect(tx.cycles).to.be.include("0x")
    })
});
