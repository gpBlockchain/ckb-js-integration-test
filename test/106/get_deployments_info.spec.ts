/**
 * before: `DeploymentPos` is equivalent to `"testdummy" | "light_client"`.
 *
 * after: `DeploymentPos` is equivalent to `"Testdummy" | "LightClient"`.
 */

/**
 * before: `DeploymentState` is equivalent to `"defined" | "started" | "locked_in" | "active" | "failed"`.
 *
 * after:  `DeploymentState` is equivalent to `"Defined" | "Started" | "LockedIn" | "Active" | "Failed"`.
 */


import {CKB_RPC_URL, RPCClient} from "../../config/config";
import {request} from "../util/util";
import {expect} from "chai";

describe('get_deployments_info', function () {
    it("dd",async ()=>{
        //todo :wait lumos adapt
        const rs = await get_deployments_info()
        expect(rs.deployments.LightClient).to.be.not.equal(undefined)
        expect(rs.deployments.LightClient.state).to.be.equal('LockedIn')

    })
});

async function get_deployments_info():Promise<any>{
    return request(1,CKB_RPC_URL,"get_deployments_info",[])
}
