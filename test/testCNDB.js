import {openH5File} from "../src/index-node.js"
import {assert} from "chai"

async function testCNDB(config) {

    const time1 = Date.now()

    const hdfFile = await openH5File(config)

    console.log(`File opened in ${Date.now() - time1} ms`)

    // fetch root group
    // const rootGroup = await hdfFile.get('/')
    // const rootKeys = new Set(rootGroup.keys)
    // assert.isTrue(rootKeys.has('Header'))
    // assert.isTrue(rootKeys.has('replica10_chr1'))


    // fetch first group
    console.log('replica')
    const group = await hdfFile.get('/replica10_chr1')

    // Genomic positions dataset
    console.log('genomic_position')
    const genomicPosition = await group.get('genomic_position')
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

    // fetch spatial position group
    console.log('spatial_position')
    const spatialPosition = await group.get('spatial_position')


    // Spatial position keys (1 for each dataset)
    const keys = spatialPosition.keys
    assert.equal(keys.length, 9999)

    // first dataset
    console.log('first dataset')
    const sp1 = await spatialPosition.get(keys[0])

    const s1 = await sp1.shape
    assert.equal(s1.length, 2)
    assert.equal(s1[0], 4980)
    assert.equal(s1[1], 3)

    const t1 = await sp1.dtype
    assert.equal(t1, '<f4')

    const values1 = await sp1.value
    assert.equal(values1.length, s1[0] * s1[1])
    assert.equal(values1[0], 3.463745594024658)
    assert.equal(values1[values1.length - 1], 4.335586071014404)

    // Second dataset
    console.log("Start second dataset")
    const time2 = Date.now()
    const sp2 = await hdfFile.get('/replica10_chr1/spatial_position/1149')

    console.log("Get shape")
    const s2 = await sp2.shape
    assert.equal(s1.length, 2)
    assert.equal(s2[0], 4980)
    assert.equal(s2[1], 3)

    console.log("Get type")
    const t2 = await sp2.dtype
    assert.equal(t2, '<f4')

    console.log("Get value")
    const values2 = await sp2.value
    assert.equal(values2.length, s1[0] * s1[1])
    assert.equal(values2[0], 7.750027179718018)
    assert.equal(values2[values1.length - 1], 6.615085124969482)

    console.log(`Second dataset loded in ${Date.now() - time2} ms`)

    // Third dataset
    const time3 = Date.now()
    const sp3 = await spatialPosition.get('1150')
    const values3 = await sp3.value
    console.log(`Third dataset loded in ${Date.now() - time3} ms`)

    // Fourth dataset
    const time4 = Date.now()
    const sp4 = await spatialPosition.get('1151')
    const values4 = await sp4.value
    console.log(`Fourth dataset loded in ${Date.now() - time4} ms`)


}

export {testCNDB}