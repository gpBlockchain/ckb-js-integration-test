/**
 * Request
 * ```
 * {
 *   "id": 42,
 *   "jsonrpc": "2.0",
 *   "method": "get_transaction",
 *   "params": [
 *     "0xa0ef4eb5f4ceeb08a4c8524d84c5da95dce2f608e0ca2ec8091191b0f330c6e3"
 *   ]
 * }
 * ```
 * Response
 * ```
 * {
 *   "id": 42,
 *   "jsonrpc": "2.0",
 *   "result": {
 *     "transaction": {
 *       "cell_deps": [
 *         {
 *           "dep_type": "code",
 *           "out_point": {
 *             "index": "0x0",
 *             "tx_hash": "0xa4037a893eb48e18ed4ef61034ce26eba9c585f15c9cee102ae58505565eccc3"
 *           }
 *         }
 *       ],
 *       "hash": "0xa0ef4eb5f4ceeb08a4c8524d84c5da95dce2f608e0ca2ec8091191b0f330c6e3",
 *       "header_deps": [
 *         "0x7978ec7ce5b507cfb52e149e36b1a23f6062ed150503c85bbf825da3599095ed"
 *       ],
 *       "inputs": [
 *         {
 *           "previous_output": {
 *             "index": "0x0",
 *             "tx_hash": "0x365698b50ca0da75dca2c87f9e7b563811d3b5813736b8cc62cc3b106faceb17"
 *           },
 *           "since": "0x0"
 *         }
 *       ],
 *       "outputs": [
 *         {
 *           "capacity": "0x2540be400",
 *           "lock": {
 *             "code_hash": "0x28e83a1277d48add8e72fadaa9248559e1b632bab2bd60b27955ebc4c03800a5",
 *             "hash_type": "data",
 *             "args": "0x"
 *           },
 *           "type": null
 *         }
 *       ],
 *       "outputs_data": [
 *         "0x"
 *       ],
 *       "version": "0x0",
 *       "witnesses": []
 *     },
 *     "cycles": "0x219",
 *     "tx_status": {
 *       "block_hash": null,
 *       "status": "pending",
 *       "reason": null
 *     }
 *   }
 * }
 * ```
 *
 *
 *
 */

import {CKB_RPC_URL, RPCClient} from "../../config/config";
import {request} from "../util/util";
import {BI} from "@ckb-lumos/lumos";
import {expect} from "chai";

describe('get_transaction', function () {
    let existTx;
    this.timeout(100000_000)
    before(async () => {
        let tip = await RPCClient.getTipHeader()
        let blk = await RPCClient.getBlockByNumber(BI.from(tip.number).toHexString())
        existTx = blk.transactions[0].hash
    })
    it("get tx ,should return include cycles", async () => {
        // todo :wait lumos adapt
        //0x3e8795baab13a6590077fed50bd10153302189492348c6e73948fa741ba8cd3e cycles = null
        let rs = await get_transaction(existTx)
        expect(rs.cycles).to.be.equal(null)
    })


});

async function get_transaction(tx_hash: string): Promise<any> {
    return request(1, CKB_RPC_URL, "get_transaction", [tx_hash])
}
