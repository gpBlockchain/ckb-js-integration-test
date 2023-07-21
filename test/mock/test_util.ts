import * as fs from 'fs';
import axios from 'axios';
import {RPCClient} from "../../config/config";
import {RPC} from "@ckb-lumos/rpc";

jest.mock('axios');
const mockRound = jest.spyOn(Math, 'round');

export function setupMockRpcTest() {


    let requestData: any;
    let responseData: any;
    let RPCClient: RPC;

    beforeEach(async () => {
        RPCClient = new RPC("http://127.0.0.1:8114");
        let data = get_method_and_params(expect.getState().currentTestName);
        requestData = JSON.parse(await readFile(`ckb-rpc-mock-data/${data.method}/${data.params}/request.json`));
        responseData = JSON.parse(await readFile(`ckb-rpc-mock-data/${data.method}/${data.params}/response.json`));
        mockRound.mockReturnValue(42);
        jest.mock('axios');

        // @ts-ignore
        axios.mockResolvedValue({
            data: responseData
        });
        console.log(requestData)
        console.log(responseData)
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    function getMockData() {
        return {RPCClient,requestData, responseData};
    }

    // Store the data in the test context using this
    return getMockData;
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

function readFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

export function getRequestCall(data: any) {
    return {
        "data": data,
        "headers": {"content-type": "application/json"},
        "httpAgent": undefined,
        "httpsAgent": undefined,
        "method": "POST",
        "timeout": 30000,
        "url": "http://127.0.0.1:8114"
    }
}