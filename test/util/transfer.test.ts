import {FeeRate, getCkbBalance, transfer} from "../../service/transfer";
import {generateAccountFromPrivateKey} from "../../service/txService";
import {ACCOUNT_PRIVATE_1, ACCOUNT_PRIVATE_2, RPCClient} from "../../config/config";

describe('transfer', function () {

    this.timeout(1000_000)
    it("transfer demo", async () => {
        let account = generateAccountFromPrivateKey(ACCOUNT_PRIVATE_2);
        let account2 = generateAccountFromPrivateKey(ACCOUNT_PRIVATE_1);
        const txMsg = await transfer({
            from: account.address,
            to: account2.address,
            amount: "100000000000",
            privKey: ACCOUNT_PRIVATE_2,
            feeRate: FeeRate.NORMAL
        })
        const tx = await RPCClient.sendTransaction(txMsg)
        console.log(tx)

    })

    it("query balance", async () => {
        const address = "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsq2r65yajlexqpazsheeysw0ln2pz9t3jmqggwdv5";
        const balance = await getCkbBalance(address)
        console.log('balance:',balance)
    })

});