import {get_cells, get_cells_capacity, getSearchKeyByMode} from "./util";
import {expect} from "chai";
import {BI} from "@ckb-lumos/lumos";

describe('get_cells_capacity', function () {

    this.timeout(1000 * 10000)
    it("script_search_mode:null => null == pre", async () => {
        let searchDemo = getSearchKeyByMode(undefined)
        let cellsCapacity = await get_cells_capacity(searchDemo)
        searchDemo = getSearchKeyByMode("prefix")
        let prefixCellsCapacity = await get_cells_capacity(searchDemo)
        expect(cellsCapacity.capacity).to.be.equal(prefixCellsCapacity.capacity)
    })
    it("script_search_mode:prefix: get_cells total = get_cells_capacity", async () => {

        let searchDemo = getSearchKeyByMode("prefix")

        const cell = await get_cells(searchDemo, "asc", "0xfff", undefined)
        let prefixCellsCapacity = await get_cells_capacity(searchDemo)
        let get_cell_cap = BI.from("0");
        for (let i = 0; i < cell.objects.length; i++) {
            get_cell_cap = get_cell_cap.add(BI.from(cell.objects[i].output.capacity))
        }
        expect(get_cell_cap.toHexString()).to.be.equal(prefixCellsCapacity.capacity)
    })
    it("script_search_mode:exact ", async () => {

        const cell = await get_cells(getSearchKeyByMode("exact"), "asc", "0xfff", undefined)
        let exactCellsCapacity = await get_cells_capacity(getSearchKeyByMode("exact"))
        let get_cell_cap = BI.from("0")
        for (let i = 0; i < cell.objects.length; i++) {
            expect(getSearchKeyByMode("exact").script).to.be.deep.equal(cell.objects[i].output.lock)
            get_cell_cap = get_cell_cap.add(BI.from(cell.objects[i].output.capacity))
        }
        expect(get_cell_cap.toHexString()).to.be.equal(exactCellsCapacity.capacity)
    })

    it("script_search_mode:exact: all cells with fuzzy matches are queried in exact match mode", async () => {
        let searchDemo = getSearchKeyByMode("prefix")
        const cells = await get_cells(searchDemo, "asc", "0xfff", undefined)
        let argsArr = cells.objects.map(obj => obj.output.lock.args).filter((item, index, arr) => arr.indexOf(item) === index)
        argsArr.forEach(args => {
            console.log(args)
        })
        for (let i = 0; i < argsArr.length; i++) {
            let exactSearch = getSearchKeyByMode("exact", argsArr[i])
            const exactCells = await get_cells(exactSearch, "asc", "0xfff", undefined)
            let get_cell_cap = BI.from("0")
            for (let j = 0; j < exactCells.objects.length; j++) {
                expect(getSearchKeyByMode("exact", exactSearch.script.args).script).to.be.deep.equal(exactCells.objects[j].output.lock)
                get_cell_cap = get_cell_cap.add(BI.from(exactCells.objects[j].output.capacity))
            }
            let exactCellsCapacity = await get_cells_capacity(exactSearch)
            expect(get_cell_cap.toHexString()).to.be.equal(exactCellsCapacity.capacity)
        }
    })


    it("script_search_mode:other => return error", async () => {

        const searchDemo = getSearchKeyByMode("other")
        try {
            await get_cells_capacity(searchDemo)
        } catch (e) {
            return
        }
        expect.fail("expected failed  ")
    })
});
