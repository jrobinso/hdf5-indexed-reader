import {testCNDB} from "./testCNDB"

suite("test", function () {


    test("cndb - indexed -- remote", async function () {

        this.timeout(100000)
        const startTime = Date.now()

        const remoteConfig = {
            url: "https://dl.dropboxusercontent.com/s/53fbs3le4a65noq/spleen_1chr1rep.indexed.cndb?dl=0"
        }

        await testCNDB(remoteConfig)

        //console.log(`cndb - indexed -- remote finished in ${Date.now() - startTime} ms`)

    })

    test("cndb - external index -- remote", async function () {

        this.timeout(100000)
        const startTime = Date.now()

        // Create HDF5 file
        const localConfig = {
            url: "https://dl.dropboxusercontent.com/s/7hmj25az1vgaejf/spleen_1chr1rep.cndb?dl=0",
            indexURL: "https://dl.dropboxusercontent.com/s/omo9fbp00ndgkv1/spleen_1chr1rep.indexed.index.json?dl=0"
        }

        await testCNDB(localConfig)

        console.log(`cndb - external index -- local finished in ${Date.now() - startTime} ms`)

    })

})
