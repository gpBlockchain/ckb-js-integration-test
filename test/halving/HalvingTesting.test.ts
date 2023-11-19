import {CKB_RPC_URL, RPCClient} from "../../config/config";
import {BI, since, Transaction} from "@ckb-lumos/lumos";
import {request} from "../util/util";
import {checkIsWithdraw2Tx, getWithdrawingCompensation, verifyDaoByBlockNum} from "./dao";


// const initial_primary_epoch_reward = 191780821917808
// const secondary_epoch_reward = 61369863013698
//https://nervoshalving.com/
describe('HalvingTesting Test', function () {

    this.timeout(100000000000000)
    let initial_primary_epoch_reward;
    let secondary_epoch_reward;
    let primary_epoch_reward_halving_interval;
    before(async () => {
        const conses = await request(1, CKB_RPC_URL, "get_consensus", [])
        initial_primary_epoch_reward = BI.from(conses["initial_primary_epoch_reward"]).toNumber()
        secondary_epoch_reward = BI.from(conses["secondary_epoch_reward"]).toNumber()
        primary_epoch_reward_halving_interval = BI.from(conses["primary_epoch_reward_halving_interval"]).toNumber()
        console.log('initial_primary_epoch_reward:', initial_primary_epoch_reward)
        console.log('secondary_epoch_reward:', secondary_epoch_reward)
        console.log('primary_epoch_reward_halving_interval:', primary_epoch_reward_halving_interval)
    })
    it("get current epoch", async () => {
        const epoch = await RPCClient.getCurrentEpoch()
        console.log(epoch)
        console.log("start:", BI.from(epoch.startNumber).toNumber())
        console.log("current epoch :", BI.from(epoch.number).toNumber())
        console.log("length:", BI.from(epoch.length).toNumber())
    })

    it("get conses", async () => {
        const conses = await request(1, CKB_RPC_URL, "get_consensus", [])
        // 一级奖励: 191780821917808
        console.log("initial_primary_epoch_reward:", BI.from(conses["initial_primary_epoch_reward"]).toNumber())
        console.log("primary_epoch_reward_halving_interval:", BI.from(conses["primary_epoch_reward_halving_interval"]).toNumber())
        // 二级奖励：61369863013698
        console.log("secondary_epoch_reward:", BI.from(conses["secondary_epoch_reward"]).toNumber())
    })

    it("get block Reward", async () => {

        let tipHeader = await RPCClient.getTipHeader()
        let end = BI.from(tipHeader.number).toNumber()
        let begin = BI.from(tipHeader.number).sub(3).toNumber()
        await getBlockRewardRange(begin, end)
    })
    it("verify block",async ()=>{
        let tipHeader = await RPCClient.getTipHeader()
        let end = BI.from(tipHeader.number).toNumber()
        let begin = BI.from(tipHeader.number).sub(3).toNumber()
        await verifyBlockRange(begin, end)
    })

    it("get commit fee", async () => {
        await getCommitFeeByBlockNumber(11074804)
    })

    it("get proposal reward", async() => {
        await getProposalsRewardByBlockNumber(11370836)
    })

    async function verifyBlockRange(begin:number,end:number){
        for (let i = begin; i < end; i++) {
            console.log(`verify block:${i}`)
            await verifyDaoByBlockNum(BI.from(i).toHexString())
        }

    }

    async function getBlockRewardRange(begin: number, end: number) {
        let arrays = []
        for (let i = begin; i < end; i++) {
            console.log(`getBlockReward:${i}`)
            let msg = await getBlockReward(BI.from(i).toHexString())
            arrays.push(msg)
        }
        printTable(arrays)
    }

    function printTable(msg: Array<{
        secondaryReward: number;
        epochLength: any;
        blockNum: number;
        epoch: any;
        epochIdx: any;
        baseReward: number;
        QueryReward: number;
        calculateReward: number;
    }>) {
        const columns = [
            'blockNum',
            'epoch',
            'epochIdx',
            'epochLength',
            'baseReward',
            'secondaryReward',
            'calculateReward',
            'QueryReward',
        ];
        console.table(msg, columns);
    }

    async function getBlockReward(blockNumber: string): Promise<{
        secondaryReward: number;
        epochLength: any;
        blockNum: number;
        epoch: any;
        epochIdx: any;
        baseReward: number;
        QueryReward: number;
        calculateReward: number;
    }> {
        let block = await RPCClient.getBlockByNumber(blockNumber)
        let rewardBLock = await RPCClient.getBlockByNumber(BI.from(blockNumber).sub(BI.from("12")).toHexString())
        let epoch = since.parseEpoch(block.header.epoch)
        let baseReward = getBaseReward(epoch.number, epoch.length)
        let secondaryReward = getSecondeReward(epoch.length, rewardBLock.header.dao)
        let total = baseReward + secondaryReward
        return {
            blockNum: BI.from(blockNumber).toNumber(),
            QueryReward: BI.from(block.transactions[0].outputs[0].capacity).toNumber() / 100000000,
            baseReward: baseReward,
            epoch: epoch.number,
            epochIdx: epoch.index,
            epochLength: epoch.length,
            secondaryReward: secondaryReward,
            calculateReward: total
        }
    }

    async function getCommitFeeByBlockNumber(blockNumber: number): Promise<number>{
        /**
         * get block返回取transactions[1->n].{inputs.previous_output.tx_hash和index}
         * get_transaction查询该tx_hash返回的outputs[index].capacity为一个input，遍历transactions[1->n]则得到inputs.capacity
         * get block返回取transactions[1->n].{outputs},遍历transactions[1->n]则得到outputs.capacity
         * commit_fee = (inputs.capacity - outputs.capacity) * 0.6
         */
        let Block =  await RPCClient.getBlockByNumber(BI.from(blockNumber - 11).toHexString());
        let transactions = Block.transactions;
        let sum_inputs = BI.from(0).toNumber();
        let sum_outputs = BI.from(0).toNumber();
        for (let i = 1; i < transactions.length; i++) { //txn
            let inputs_cap = BI.from(0).toNumber();
            let outputs_cap = BI.from(0).toNumber();
            for (let j = 0; j < transactions[i].inputs.length; j++) {
                let txHash = transactions[i].inputs[j].previousOutput.txHash;
                let index = BI.from(transactions[i].inputs[j].previousOutput.index).toNumber();
                let tx = await RPCClient.getTransaction(txHash);
                let outputs = tx.transaction.outputs;
                if (await checkIsWithdraw2Tx(txHash)) {
                    const completed_withdrawals_capacities = await getWithdrawingCompensation(txHash)
                    inputs_cap +=  BI.from(outputs[index].capacity).add(completed_withdrawals_capacities).toNumber();
                }
                inputs_cap +=  BI.from(outputs[index].capacity).toNumber();
            }
            for (let j = 0; j < transactions[i].outputs.length; j++) {
                outputs_cap +=  BI.from(transactions[i].outputs[j].capacity).toNumber();
            }
            console.log(`transaction${i}::inputs: ${inputs_cap} -> outputs: ${outputs_cap}`)
            sum_inputs += inputs_cap;
            sum_outputs += outputs_cap;
        }
        let commit_fee = roundTo8thDecimal(0.6 * (sum_inputs - sum_outputs) / 10000_0000);
        console.log(`commit_fee:${commit_fee}`);
        return commit_fee;
    }

    async function getProposalsRewardByBlockNumber(blockNumber: number): Promise<number>{
        /**
         * (N - 11) + 2 -> (N - 11) + 10 = N - 9 -> N -1 Block遍历确认并且N - 11中提交的交易，为所有符合条件交易手续费总和的40%
         * 遍历 (N - 11) + 2  ~ (N - 11) + 10,看以上交易是否被确认并查看手续费
         *
         */
        let txs:Transaction[] = [];
        for (let j = 0; j < 11; j++) {
            let Block =  await RPCClient.getBlockByNumber(BI.from(blockNumber - 11 + 2 + j).toHexString());// N - 9 -> N -1 Block
            for (let k = 0; k < Block.transactions.length; k++) {
                const proposals = await getProposals(blockNumber);
                console.log(`N-9 -> N-1 tx:${Block.transactions[k].hash}`)
                if (proposals.includes(Block.transactions[k].hash.substring(0, 22))) {
                    console.log(`found proposals tx:${Block.transactions[k].hash}`);
                    txs.push(Block.transactions[k])
                }
            }
        }
        return await calFeeByTxHash(txs);
    }

    async function getProposals(blockNumber: number):Promise<string[]>{
        let proposals: string[] = [];
        let Block =  await RPCClient.getBlockByNumber(BI.from(blockNumber - 11).toHexString());
        for (let i = 0; i < Block.proposals.length; i++) {
            console.log(`need found N-11 proposal tx:${Block.proposals[i]}`)
            proposals.push(Block.proposals[i])
        }
        return proposals;
    }

    async function calFeeByTxHash(transactions: Transaction[]):Promise<number>{
        let sum_inputs = BI.from(0).toNumber();
        let sum_outputs = BI.from(0).toNumber();
        for (let i = 1; i < transactions.length; i++) { //txn
            let inputs_cap = BI.from(0).toNumber();
            let outputs_cap = BI.from(0).toNumber();
            for (let j = 0; j < transactions[i].inputs.length; j++) {
                let txHash = transactions[i].inputs[j].previousOutput.txHash;
                let index = BI.from(transactions[i].inputs[j].previousOutput.index).toNumber();
                let tx = await RPCClient.getTransaction(txHash);
                let outputs = tx.transaction.outputs;
                if (await checkIsWithdraw2Tx(txHash)) {
                    const completed_withdrawals_capacities = await getWithdrawingCompensation(txHash)
                    inputs_cap +=  BI.from(outputs[index].capacity).add(completed_withdrawals_capacities).toNumber();
                }
                inputs_cap +=  BI.from(outputs[index].capacity).toNumber();
            }
            for (let j = 0; j < transactions[i].outputs.length; j++) {
                outputs_cap +=  BI.from(transactions[i].outputs[j].capacity).toNumber();
            }
            console.log(`transaction${i}::inputs: ${inputs_cap} -> outputs: ${outputs_cap}`)
            sum_inputs += inputs_cap;
            sum_outputs += outputs_cap;
        }
        let proposal_fee = roundTo8thDecimal(0.4 * (sum_inputs - sum_outputs) / 10000_0000);
        console.log(`proposal_fee:${proposal_fee}`);
        return proposal_fee;
    }

    function roundTo8thDecimal(num: number): number {
        const factor = Math.pow(10, 8);
        return Math.round(num * factor) / factor;
    }


    function getBaseReward(epoch: number, epochLength: number) {
        let reward = initial_primary_epoch_reward;
        if (epoch >= primary_epoch_reward_halving_interval) {
            reward = reward / 2
        }
        return reward / (epochLength * 100000000)
    }

    function getSecondeReward(epochLength: number, dao: string) {
        // 二类增发
        // let secondaryReward = secondary_epoch_reward / epochLength

        //二类增发矿工比例
        let decodeDaoArr = decodeDao(dao)
        //(4658604079644744768, 10824404150119313, 272396222424927679, 597160254100000000)
        // 613698.63013698/1800 * (597160254100000000/4658604079644744768)=43.70365309818153
        // let miner =
        return secondary_epoch_reward / 100000000 / epochLength * (decodeDaoArr[3] / decodeDaoArr[0])
    }

    function decodeDao(dao: string): number[] {
        const buffer = Buffer.from(dao.replace("0x", ""), 'hex');
        const values = [];
        for (let i = 0; i < 4; i++) {
            const value = buffer.readBigUInt64LE(i * 8);
            values.push(BI.from(value.toString()).toNumber());
        }
        return values;
    }

});
