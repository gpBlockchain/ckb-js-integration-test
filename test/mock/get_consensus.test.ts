import { mock_rpc} from "./test_util";
import axios from 'axios';
describe('get_consensus', function () {

    it('[]', async () => {
        let {RPCClient, requestData, responseData} = await mock_rpc()
        let consensus = await RPCClient.getConsensus()
        // TODO add check hardforkFeatures
        // TODO add check threshold
    });

});