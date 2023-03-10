import {testCNDB} from "./testCNDB.js"

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

})
