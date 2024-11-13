import {encodeToAddress, parseAddress} from "@ckb-lumos/helpers";
import {transfer} from "../../service/transfer";
import {generateAccountFromPrivateKey} from "../../service/txService";
import {ACCOUNT_PRIVATE_2, RPCClient} from "../../config/config";
import {BI} from "@ckb-lumos/bi";

describe('data2', function () {

    it("address encode", async () => {
        let address = encodeToAddress({
            args: "0x1234",
            codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
            hashType: "data2"
        })

        let script = parseAddress(address)
        console.log(script)
    })

    it("build data2 tx", async () => {
        let address = encodeToAddress({
            args: "0x1234",
            codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
            hashType: "data2"
        })
        const account = generateAccountFromPrivateKey(ACCOUNT_PRIVATE_2);
        let txMsg = await transfer({
            amount: BI.from("10000000000").toHexString(),
            feeRate: 1000,
            from: account.address,
            privKey: ACCOUNT_PRIVATE_2,
            to: address

        })
        // @ts-ignore
        let tx_hash = await RPCClient.estimateCycles(txMsg)
        console.log("tx Hash:", tx_hash)
    }, 10000)

});
