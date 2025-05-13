import {testCNDB} from "./testCNDB.js"
import sinon from 'sinon'
import {assert, expect} from 'chai'
import {openH5File} from "../dist/hdf5-indexed-reader.node.cjs"

suite("test", function () {


    test("cndb - indexed -- remote", async function () {

        this.timeout(100000)

        const config = {
            url: "https://jbrowse.org/demos/ldmat/chr21_partial.h5"
        }

        const hdfFile = await openH5File(config)


        // fetch root group
        // const rootGroup = await hdfFile.get('/')
        // const rootKeys = new Set(rootGroup.keys)
        // assert.isTrue(rootKeys.has('Header'))
        // assert.isTrue(rootKeys.has('replica10_chr1'))


        // fetch first group
        console.log('replica')
        const group = await hdfFile.get('/chunk_15000001')

        // LDMAT dataset
        console.log('genomic_position')
        const genomicPosition = await group.get('LD_values')
        console.log('genomic_position shape')
        const shape = await genomicPosition.shape
        console.log('genomic_position value')
        const array = await genomicPosition.value
        assert.equal(shape.length, 2)
        assert.equal(shape[0], 4980)
        assert.equal(shape[1], 2)
        assert.equal(await genomicPosition.dtype, '<i8')
        assert.equal(array.length, 9960)
        assert.equal(array[0], 1)
        assert.equal(array[9959], 249000001)



    })

})
