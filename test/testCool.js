import {assert} from 'chai'
import {openH5File} from "../src/open.js"

suite("test", function () {

    test("COOL -- no index -- local", async function () {

        this.timeout(100000)

        const startTime = Date.now()

        // create HDF5 file object
        const localConfig = {path: require.resolve("./spleen_1chr1rep.cndb")}

        await testCOOL(localConfig)

        console.log(`cndb -- no index -- local finished in ${Date.now() - startTime} ms`)
    })


    async function testCOOL(config) {

        config = {
            path: require.resolve("./Rao2014-NHEK-MboI-allreps-filtered.500kb.hdf5")

        }
        const hdfFile = await openH5File(config)

        // fetch root group
        const rootGroup = await hdfFile.get('/')
        const rootKeys = rootGroup.keys
        assert.equal(rootKeys.length, 4)
        assert.equal(rootKeys[0], 'bins')
        assert.equal(rootKeys[1], 'chroms')
        assert.equal(rootKeys[2], 'indexes')
        assert.equal(rootKeys[3], 'pixels')

        // fetch compressed dataset
        const pixelDataset = await hdfFile.get('/pixels/bin1_id')

        const s1 = await pixelDataset.shape
        assert.equal(s1.length, 1)
        assert.equal(s1[0], 16082492)

        const data = await pixelDataset.value
        assert.equal(data.length, 16082492)
        assert.equal(data[data.length - 1], 6085)
    }

})
