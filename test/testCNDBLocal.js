import {openH5File} from "../src/open.js"

import {testCNDB} from "./testCNDB"

suite("test", function () {



    test("cndb -- internal index -local", async function () {

        this.timeout(100000)

        const startTime = Date.now()

        // create HDF5 file object
        const localConfig = {path: require.resolve("./spleen_1chr1rep.indexed.cndb")}

        await testCNDB(localConfig)

        console.log(`cndb -- internal index -- local finished in ${Date.now() - startTime} ms`)
    })


    test("cndb -- no index -- local", async function () {

        this.timeout(100000)

        const startTime = Date.now()

        // create HDF5 file object
        const localConfig = {path: require.resolve("./spleen_1chr1rep.cndb")}

        await testCNDB(localConfig)

        console.log(`cndb -- no index -- local finished in ${Date.now() - startTime} ms`)
    })

})
