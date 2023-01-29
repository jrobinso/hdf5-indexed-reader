import {assert} from 'chai'
import {openH5File} from "../src/open.js"

suite("test", function () {


    test("cool - indexed -- remote", async function () {

        this.timeout(100000)

        const config = {
            url: "https://dl.dropboxusercontent.com/s/sa6x4xu153joc13/Rao2014-NHEK-MboI-allreps-filtered.500kb.indexed.hdf5?dl=0"
        }

        const hdfFile = await openH5File(config)

        // fetch root group
        const rootGroup = await hdfFile.get('/')
        const rootKeys = new Set(rootGroup.keys)
        assert.isTrue(rootKeys.has('bins'))
        assert.isTrue(rootKeys.has('chroms'))
        assert.isTrue(rootKeys.has('indexes'))
        assert.isTrue(rootKeys.has('pixels'))

        // fetch compressed dataset
        const pixelDataset = await hdfFile.get('/pixels/bin1_id')

        const s1 = await pixelDataset.shape
        assert.equal(s1.length, 1)
        assert.equal(s1[0], 16082492)

        const data = await pixelDataset.value
        assert.equal(data.length, 16082492)
        assert.equal(data[data.length - 1], 6085)
    })


    test("cndb - indexed -- local", async function () {

        this.timeout(100000)

        const config = {
            path: require.resolve("./Rao2014-NHEK-MboI-allreps-filtered.500kb.indexed.hdf5")
        }

        const hdfFile = await openH5File(config)

        // fetch root group
        const rootGroup = await hdfFile.get('/')
        const rootKeys = new Set(rootGroup.keys)
        assert.isTrue(rootKeys.has('bins'))
        assert.isTrue(rootKeys.has('chroms'))
        assert.isTrue(rootKeys.has('indexes'))
        assert.isTrue(rootKeys.has('pixels'))

        // fetch compressed dataset
        const pixelDataset = await hdfFile.get('/pixels/bin1_id')

        const s1 = await pixelDataset.shape
        assert.equal(s1.length, 1)
        assert.equal(s1[0], 16082492)

        const data = await pixelDataset.value
        assert.equal(data.length, 16082492)
        assert.equal(data[data.length - 1], 6085)
    })


})
