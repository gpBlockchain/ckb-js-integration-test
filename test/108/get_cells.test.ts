//    script_search_mode - enum, prefix | exact, optional default is `prefix`, controls the search mode of script

import {expect} from "chai";
import {get_cells, get_transactions, getSearchKeyByMode} from "./util";


describe('get_cells', function () {

    this.timeout(1000 * 10000)
    it("script_search_mode:null => null == pre", async () => {
        let searchDemo = getSearchKeyByMode(undefined)
        let cells = await get_cells(searchDemo, "asc", "0xfff", undefined)
        searchDemo = getSearchKeyByMode("prefix")
        let prefixCells = await get_cells(searchDemo, "asc", "0xfff", undefined)
        expect(cells).to.be.deep.equal(prefixCells)
    })
    it("script_search_mode:prefix", async () => {

        let searchDemo = getSearchKeyByMode("prefix")

        const cell = await get_cells(searchDemo, "asc", "0xfff", undefined)

        for (let i = 0; i < cell.objects.length; i++) {
            if (cell.objects[i].output.lock.args.length > searchDemo.script.args.length) {
                return
            }
        }
        expect.fail("get_cells result not prefix")
    })
    it("script_search_mode:exact", async () => {
        const cell = await get_cells(getSearchKeyByMode("exact"), "asc", "0xfff", undefined)
        for (let i = 0; i < cell.objects.length; i++) {
            expect(getSearchKeyByMode("exact").script).to.be.deep.equal(cell.objects[i].output.lock)
        }
    })

    it("script_search_mode:exact: find cells that ", async () => {
        let searchDemo = getSearchKeyByMode("prefix")
        const cells = await get_cells(searchDemo, "asc", "0xfff", undefined)
        let argsArr = cells.objects.
        map(obj=>obj.output.lock.args).
        filter( (item, index ,arr)=>arr.indexOf(item) === index )
        argsArr.forEach(args=>{
            console.log(args)
        })
        for (let i = 0; i < argsArr.length; i++) {
            let exactSearch = getSearchKeyByMode("exact",argsArr[i])
            const exactCells = await get_cells(exactSearch, "asc", "0xfff", undefined)
            for (let j = 0; j < exactCells.objects.length; j++) {
                expect(getSearchKeyByMode("exact",exactSearch.script.args).script).to.be.deep.equal(exactCells.objects[j].output.lock)
            }
        }
        argsArr.forEach(args=>{
            console.log(args)
        })
    })


    it("script_search_mode:other", async () => {

        const searchDemo = getSearchKeyByMode("other")
        try {
            await get_cells(searchDemo, "asc", "0xfff", undefined)
        } catch (e) {
            return
        }
        expect.fail("expected failed  ")
    })
});

