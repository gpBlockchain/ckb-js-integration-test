import {BI} from "@ckb-lumos/bi";
import {dao} from "@ckb-lumos/common-scripts";
import {extractDaoDataCompatible} from "@ckb-lumos/common-scripts/lib/dao";
import {CKB_RPC_URL, RPCClient} from "../../config/config";
import {minimalCellCapacityCompatible} from "@ckb-lumos/helpers";
import {since} from "@ckb-lumos/lumos";
import {request} from "../util/util";
import {EpochSinceValue} from "@ckb-lumos/base/lib/since";
import {CKBComponents} from "@ckb-lumos/rpc/lib/types/api";


export async function unpackHeaderDao(dao: string): Promise<{ C: BI, AR: BI, S: BI, U: BI }> {
    let ret = extractDaoDataCompatible(dao)
    return {
        C: ret['c'],
        AR: ret['ar'],
        S: ret['s'],
        U: ret["u"]
    }
}

export async function verifyDaoByBlockNum(blockNum: string): Promise<boolean> {
    let block = await RPCClient.getBlockByNumber(blockNum)
    let daoMsg = await unpackHeaderDao(block.header.dao)
    let calculateDaoMsg = await calculateDao(blockNum)

    let ret = true;
    if (!calculateDaoMsg.AR.eq(daoMsg.AR)) {
        console.error(`AR not eq:${calculateDaoMsg.AR.toBigInt()} != ${daoMsg.AR.toBigInt()}`)
        ret = false;
    }
    if (!calculateDaoMsg.U.eq(daoMsg.U)) {
        console.error(`U not eq:${calculateDaoMsg.U.toBigInt()} != ${daoMsg.U.toBigInt()}`)
        ret = false;
    }
    if (!calculateDaoMsg.S.eq(daoMsg.S)) {
        console.error(`S not eq:${calculateDaoMsg.S.toBigInt()} != ${daoMsg.S.toBigInt()}`)
        ret = false;
    }
    if (!calculateDaoMsg.C.eq(daoMsg.C)) {
        console.error(`C not eq:${calculateDaoMsg.C.toBigInt()} != ${daoMsg.C.toBigInt()}`)
        ret = false;
    }
    if (ret) {
        return true;
    }
    // if (calculateDaoMsg.AR.eq(daoMsg.AR) &&
    //     calculateDaoMsg.S.eq(daoMsg.S) &&
    //     calculateDaoMsg.U.eq(daoMsg.U) &&
    //     calculateDaoMsg.C.eq(daoMsg.C)
    // ) {
    //     return true
    // }
    console.error("--- calculateDaoMsg--- ")
    console.table(calculateDaoMsg)
    console.error("--- daoMsg ---- ")
    console.error("C:", daoMsg.C.toBigInt())
    console.error("AR:", daoMsg.AR.toBigInt())
    console.error("S:", daoMsg.S.toBigInt())
    console.error("U:", daoMsg.U.toBigInt())
    return ret;
}

async function calculateDao(blockNum: string): Promise<{
    C: BI, AR: BI, S: BI, U: BI,
    c: bigint, ar: bigint, s_: bigint, u: bigint,
    pre_c: bigint, pre_ar: bigint, pre_s: bigint, pre_u: bigint,
    p: bigint, s: bigint, u_in: bigint, u_out: bigint, c_in: bigint, c_out: bigint, i: bigint
}> {

    let preBlock = await RPCClient.getBlockByNumber(BI.from(blockNum).sub(1).toHexString())
    let pre_block_dao_data = await unpackHeaderDao(preBlock.header.dao)
    let current_block_dao_msg = await getDaoMsg(BI.from(blockNum));

    // 1. verify C_i : C_{i-1} + p_i + s_i
    let C = pre_block_dao_data.C.add(current_block_dao_msg.p).add(current_block_dao_msg.s)


    // 2. verify U_i : U_{i-1} + U_{out,i} - U_{in,i}
    let U = pre_block_dao_data.U.add(current_block_dao_msg.u_out).sub(current_block_dao_msg.u_in)


    // 3. verify S_i : S_{i-1} - I_i + s_i - floor( s_i * U_{i-1} / C_{i-1} )
    let S = pre_block_dao_data.S.sub(current_block_dao_msg.i).add(current_block_dao_msg.s).sub(BI.from(Math.floor(current_block_dao_msg.s.mul(pre_block_dao_data.U).div(pre_block_dao_data.C).toNumber())))


    // 4. verify AR_i : AR_{i-1} + floor( AR_{i-1} * s_i / C_{i-1} )
    let AR = pre_block_dao_data.AR.add(BI.from(Math.floor(pre_block_dao_data.AR.mul(current_block_dao_msg.s).div(pre_block_dao_data.C).toNumber())))
    return {
        AR: AR, C: C, S: S, U: U,

        ar: AR.toBigInt(),
        c: C.toBigInt(),
        s_: S.toBigInt(),
        u: U.toBigInt(),
        pre_c: pre_block_dao_data.C.toBigInt(),
        pre_ar: pre_block_dao_data.AR.toBigInt(),
        pre_s: pre_block_dao_data.S.toBigInt(),
        pre_u: pre_block_dao_data.U.toBigInt(),

        c_in: current_block_dao_msg.c_in.toBigInt(),
        c_out: current_block_dao_msg.c_out.toBigInt(),
        i: current_block_dao_msg.i.toBigInt(),
        p: current_block_dao_msg.p.toBigInt(),
        s: current_block_dao_msg.s.toBigInt(),
        u_in: current_block_dao_msg.u_in.toBigInt(),
        u_out: current_block_dao_msg.u_out.toBigInt()
    }
}

// p_i: primary issuance for block i
// s_i: secondary issuance for block i
// U_{in,i} : occupied capacities for all input cells in block i
// U_{out,i} : occupied capacities for all output cells in block i
// C_{in,i} : total capacities for all input cells in block i
// C_{out,i} : total capacities for all output cells in block i
// I_i : total compensation of completed Nervos DAO withdrawals in block i (not includes withdrawing compensation)
async function getDaoMsg(block_number: BI): Promise<{
    p: BI,
    s: BI,
    u_in: BI,
    u_out: BI,
    c_in: BI,
    c_out: BI,
    i: BI
}> {
    let block = await RPCClient.getBlockByNumber(block_number.toHexString())
    // let rewardBLock = await RPCClient.getBlockByNumber(block_number.sub(BI.from("12")).toHexString())
    let epoch = since.parseEpoch(block.header.epoch)

    // 1.  p_i: primary issuance for block i
    let primary_issuance = await get_primary_issuance(epoch)

    // 2.  s_i: secondary issuance for block i
    let secondary_issuance = await get_secondary_issuance(epoch)

    // 3. U_{in,i} : occupied capacities for all input cells in block i
    let occupied_input = BI.from(0)
    for (let i = 0; i < block.transactions.length; i++) {
        let transaction = block.transactions[i]
        for (let j = 0; j < transaction.inputs.length; j++) {
            let input = transaction.inputs[j]
            if (input.previousOutput.txHash == "0x0000000000000000000000000000000000000000000000000000000000000000") {
                continue
            }
            let tx = await RPCClient.getTransaction(input.previousOutput.txHash)
            let cap = minimalCellCapacityCompatible({
                cellOutput: tx.transaction.outputs[BI.from(input.previousOutput.index).toNumber()],
                data: tx.transaction.outputsData[BI.from(input.previousOutput.index).toNumber()]
            })
            occupied_input = occupied_input.add(cap)
        }
    }


    // 4. U_{out,i} : occupied capacities for all output cells in block i
    let occupied_output = block.transactions.reduce((accumulator, transaction) => {
        transaction.outputs.forEach((output, index) => {
            const data = transaction.outputsData[index];
            accumulator = accumulator.add(
                minimalCellCapacityCompatible({
                    cellOutput: output,
                    data: data,
                })
            );
        });
        return accumulator;
    }, BI.from(0));

    // 5. C_{in,i} : total capacities for all input cells in block i

    let total_capacities_input = BI.from(0)
    for (let i = 0; i < block.transactions.length; i++) {
        let transaction = block.transactions[i]
        for (let j = 0; j < transaction.inputs.length; j++) {
            let input = transaction.inputs[j]
            if (input.previousOutput.txHash == "0x0000000000000000000000000000000000000000000000000000000000000000") {
                continue
            }
            let tx = await RPCClient.getTransaction(input.previousOutput.txHash)
            let cap = BI.from(tx.transaction.outputs[BI.from(input.previousOutput.index).toNumber()].capacity)
            total_capacities_input = total_capacities_input.add(cap)
        }
    }


    // 6. C_{out,i} : total capacities for all output cells in block i

    let total_capacities_output = block.transactions.reduce((accumulator, transaction) => {
        transaction.outputs.forEach((output, index) => {
            const data = transaction.outputsData[index];
            accumulator = accumulator.add(BI.from(output.capacity));
        });
        return accumulator;
    }, BI.from(0));

    // 7. I_i : total compensation of completed Nervos DAO withdrawals in block i (not includes withdrawing compensation)
    let completed_withdrawals_capacities = BI.from(0)
    for (let i = 0; i < block.transactions.length; i++) {
        //todo filter withdraw 2 tx
        if (await checkIsWithdraw2Tx(block.transactions[i].hash)) {
            completed_withdrawals_capacities = completed_withdrawals_capacities.add(await getWithdrawingCompensation(block.transactions[i].hash))
        }
    }

    return {
        p: primary_issuance,
        s: secondary_issuance,
        u_in: occupied_input,
        u_out: occupied_output,
        c_in: total_capacities_input,
        c_out: total_capacities_output,
        i: completed_withdrawals_capacities
    }
}

async function get_primary_issuance(epoch: EpochSinceValue): Promise<BI> {
    const conses = await request(1, CKB_RPC_URL, "get_consensus", [])
    let initial_primary_epoch_reward = BI.from(conses["initial_primary_epoch_reward"])
    let primary_epoch_reward_halving_interval = BI.from(conses["primary_epoch_reward_halving_interval"])
    let reward = initial_primary_epoch_reward.div(epoch.length)
    let mod_number = initial_primary_epoch_reward.mod(epoch.length)
    if (epoch.number >= primary_epoch_reward_halving_interval.toNumber()) {
        reward = reward.div(2)
    }
    if (epoch.index < mod_number.toNumber()) {
        reward = reward.add(1)
    }
    return reward
}

async function get_secondary_issuance(epoch: EpochSinceValue): Promise<BI> {
    const conses = await request(1, CKB_RPC_URL, "get_consensus", [])
    let secondary_epoch_reward = BI.from(conses["secondary_epoch_reward"])
    let reward = secondary_epoch_reward.div(epoch.length)
    let mod_number = secondary_epoch_reward.mod(epoch.length)
    if (epoch.index < mod_number.toNumber()) {
        reward = reward.add(1)
    }
    return reward
}

// if (await checkIsWithdraw2Tx(txHash)) {
//      completed_withdrawals_capacities = await getWithdrawingCompensation(txHash)
//  }
export async function checkIsWithdraw2Tx(tx: CKBComponents.TransactionWithStatus | string) {
    if (typeof tx == 'string') {
        tx = await RPCClient.getTransaction(tx)
    }


    if (tx.transaction.headerDeps.length != 2) {
        return false;
    }
    for (let i = 0; i < tx.transaction.inputs.length; i++) {
        let input = tx.transaction.inputs[i]
        if (input.since != undefined && input.since.length > 3) {
            return true;
        }
    }
    return false;
}

export async function getWithdrawingCompensation(tx: string | CKBComponents.TransactionWithStatus) {
    if (typeof tx == 'string') {
        tx = await RPCClient.getTransaction(tx)
    }
    let depositBlockHash = tx.transaction.headerDeps[0]
    let withdraw1BlockHash = tx.transaction.headerDeps[1]
    let depositDao = await RPCClient.getBlock(depositBlockHash)
    let withdrawDao = await RPCClient.getBlock(withdraw1BlockHash)
    for (let i = 0; i < tx.transaction.inputs.length; i++) {
        let input = tx.transaction.inputs[i]
        if (input.since != undefined && input.since.length > 3) {
            let tx = await RPCClient.getTransaction(input.previousOutput.txHash)
            let withdraw1Output = tx.transaction.outputs[BI.from(input.previousOutput.index).toNumber()]
            let cap = dao.calculateMaximumWithdraw({
                cellOutput: withdraw1Output,
                data: tx.transaction.outputsData[BI.from(input.previousOutput.index).toNumber()]
            }, depositDao.header.dao, withdrawDao.header.dao)
            return BI.from(cap).sub(BI.from(withdraw1Output.capacity));
        }
    }
    throw Error("not withdraw2 tx")
}

