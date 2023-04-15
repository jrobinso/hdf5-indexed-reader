import {testCNDB} from "./testCNDB.js"
import {openH5File} from "../src/index-node.js"
import {assert} from "chai"

suite("test", function () {

    test("cndb -- indexed", async function () {
        this.timeout(100000)
        const startTime = Date.now()
        // create HDF5 file object
        const localConfig = {path: "test/spleen_1chr1rep.indexed.cndb"}
        await testCNDB(localConfig)
        console.log(`cndb -- indexed -- local finished in ${Date.now() - startTime} ms`)
    })

    test("cndb -- indexed with offset", async function () {
        this.timeout(100000)
        const startTime = Date.now()
        // create HDF5 file object
        const localConfig = {
            path: "test/spleen_1chr1rep.indexed.cndb",
            indexOffset: 602012432
        }
        await testCNDB(localConfig)
        console.log(`cndb -- indexed -- local finished in ${Date.now() - startTime} ms`)
    })


    test("cndb -- no index -- local", async function () {
        this.timeout(100000)
        const startTime = Date.now()
        // create HDF5 file object
        const localConfig = {path: "test/spleen_1chr1rep.cndb"}
        await testCNDB(localConfig)
        console.log(`cndb -- no index -- local finished in ${Date.now() - startTime} ms`)
    })

    test("test string dataset", async function () {
        this.timeout(100000)
        const startTime = Date.now()
        // create HDF5 file object
        const localConfig = {path: "test/spleen_1chr1rep.indexed.cndb"}
        const hdfFile = await openH5File({path: "test/spleen_1chr1rep.indexed.cndb"})
        const typesDataset = await hdfFile.get('/replica10_chr1/types')
        const dtype = await typesDataset.dtype
        const types = await typesDataset.value
        assert.equal(types.length, 4980)
        // console.log(types)
    })

})
