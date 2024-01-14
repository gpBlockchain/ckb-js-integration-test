import {mock_light_rpc} from "../mock/test_util";
import {toScript} from "@ckb-lumos/rpc/lib/resultFormatter";



describe("set_scripts", function () {

    it("[Vec<ScriptStatus>,SetScriptCommand:all]", async () => {
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()
        let setLightScript = requestData["params"][0].map(({script, script_type, block_number}) => ({
            script: toScript(script),
            scriptType: script_type,
            blockNumber: block_number,
        }));
        await LightRPCClient.setScripts(setLightScript, requestData["params"][1])
    })
    it("[Vec<ScriptStatus>,SetScriptCommand:delete]",async ()=>{
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()
        let setLightScript = requestData["params"][0].map(({script, script_type, block_number}) => ({
            script: toScript(script),
            scriptType: script_type,
            blockNumber: block_number,
        }));
        await LightRPCClient.setScripts(setLightScript, requestData["params"][1])
    })

    it("[Vec<ScriptStatus>,SetScriptCommand:partial]",async ()=>{
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()
        let setLightScript = requestData["params"][0].map(({script, script_type, block_number}) => ({
            script: toScript(script),
            scriptType: script_type,
            blockNumber: block_number,
        }));
        await LightRPCClient.setScripts(setLightScript, requestData["params"][1])
    })

    it("[Vec<ScriptStatus>,null]",async ()=>{
        let {LightRPCClient, requestData, responseData} = await mock_light_rpc()
        let setLightScript = requestData["params"][0].map(({script, script_type, block_number}) => ({
            script: toScript(script),
            scriptType: script_type,
            blockNumber: block_number,
        }));
        await LightRPCClient.setScripts(setLightScript)
    })


});