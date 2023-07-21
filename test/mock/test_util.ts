import {RPC} from "@ckb-lumos/rpc";
import {get} from "../util/util";

export async function mock_rpc(){
    let data = get_method_and_params(expect.getState().currentTestName)
    return get_mock_test_data(data.method,data.params)
}
async function get_mock_test_data(method: string, params: string) {

    let data = await get(`http://127.0.0.1:5000/test/${method}/${params}`)
    let requestData = data['request']
    let responseData = data['response']
    let RPCClient = new RPC(`http://127.0.0.1:5000/test/${method}/${params}`);
    return {RPCClient,requestData, responseData}

}

function get_method_and_params(currentTestName: string): { method: string, params: string } {
    let [name, params] = splitFirstSpace(currentTestName)
    return {
        method: name, params: params
    }
}

function splitFirstSpace(input: string): [string, string] {
    const index = input.indexOf(' ');
    if (index !== -1) {
        const firstPart = input.slice(0, index);
        const restPart = input.slice(index + 1);
        return [firstPart, restPart];
    } else {
        return [input, ''];
    }
}

