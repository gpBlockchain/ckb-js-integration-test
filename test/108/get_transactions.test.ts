import {get_cells, get_transactions, getSearchKeyByMode} from "./util";
import {expect} from "chai";


describe('get_transactions', function () {
    this.timeout(1000 * 10000)
    it("script_search_mode:null => null == pre", async () => {
        let searchDemo = getSearchKeyByMode(undefined)
        let txs = await get_transactions(searchDemo, "asc", "0xfff", undefined)
        searchDemo = getSearchKeyByMode("prefix")
        let prefixTxs = await get_transactions(searchDemo, "asc", "0xfff", undefined)
        expect(txs).to.be.deep.equal(prefixTxs)
    })

    it("script_search_mode:prefix => find txs in get_cells result", async () => {

        let searchDemo = getSearchKeyByMode("prefix")

        const getCellsResponse = await get_cells(searchDemo, "asc", "0xfff", undefined)
        const getTransactionsResponse = await get_transactions(searchDemo, "asc", "0xfff", undefined)
        const getTxNotInGetCellResponse = getTransactionsResponse.objects.filter(obj => !getCellsResponse.objects.some(cellObj =>
            cellObj.block_number == obj.block_number &&
            cellObj.tx_index == obj.tx_index))
        expect(getTxNotInGetCellResponse.length).to.be.equal(0)

        for (let i = 0; i < getCellsResponse.objects.length; i++) {
            if (getCellsResponse.objects[i].output.lock.args.length > searchDemo.script.args.length) {
                return
            }
        }

        expect.fail("get_cells result not prefix")
    })
    it("script_search_mode:exact => find txs in get_cells result", async () => {
        const getTransactionResponse = await get_transactions(getSearchKeyByMode("exact"), "asc", "0xfff", undefined)
        const cell = await get_cells(getSearchKeyByMode("exact"), "asc", "0xfff", undefined)
        const getTxNotInGetCellResponse = getTransactionResponse.objects.filter(obj => !cell.objects.some(cellObj =>
            cellObj.block_number == obj.block_number &&
            cellObj.tx_index == obj.tx_index))
        expect(getTxNotInGetCellResponse.length).to.be.equal(0)
        for (let i = 0; i < cell.objects.length; i++) {
            expect(getSearchKeyByMode("exact").script).to.be.deep.equal(cell.objects[i].output.lock)
        }
    })

    it("script_search_mode:exact 2 => find txs in get_cells result ", async () => {
        let searchDemo = getSearchKeyByMode("prefix")
        const getTransactionResponse = await get_transactions(searchDemo, "asc", "0xfff", undefined)
        const cells = await get_cells(searchDemo, "asc", "0xfff", undefined)
        const getTxNotInGetCellResponse = getTransactionResponse.objects.filter(obj => !cells.objects.some(cellObj =>
            cellObj.block_number == obj.block_number &&
            cellObj.tx_index == obj.tx_index))
        expect(getTxNotInGetCellResponse.length).to.be.equal(0)

        let argsArr = cells.objects.map(obj => obj.output.lock.args).filter((item, index, arr) => arr.indexOf(item) === index)
        for (let i = 0; i < argsArr.length; i++) {
            let exactSearch = getSearchKeyByMode("exact", argsArr[i])
            const getTxs = await get_transactions(exactSearch, "asc", "0xfff", undefined)
            const exactCells = await get_cells(exactSearch, "asc", "0xfff", undefined)

            const getTxNotInGetCellResponse = getTxs.objects.filter(obj => !exactCells.objects.some(cellObj =>
                cellObj.block_number == obj.block_number &&
                cellObj.tx_index == obj.tx_index))
            expect(getTxNotInGetCellResponse.length).to.be.equal(0)

            for (let j = 0; j < exactCells.objects.length; j++) {
                expect(getSearchKeyByMode("exact", exactSearch.script.args).script).to.be.deep.equal(exactCells.objects[j].output.lock)
            }
        }
    })


    it("script_search_mode:other => find txs in get_cells result", async () => {

        const searchDemo = getSearchKeyByMode("other")
        try {
            await get_transactions(searchDemo, "asc", "0xfff", undefined)
        } catch (e) {
            return
        }
        expect.fail("expected failed  ")
    })
});
