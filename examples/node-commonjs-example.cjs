

(async function () {
    const {openH5File} = require("../dist/hdf5-indexed-reader.node.cjs")

    console.log('Opening remote file')
    const t0 = Date.now()
    const hdfFile = await openH5File({
        url: "https://dl.dropboxusercontent.com/s/53fbs3le4a65noq/spleen_1chr1rep.indexed.cndb?dl=0"
    })
    console.log(`Opened in ${Date.now() - t0} ms`)

    // fetch root group
    const rootGroup = await hdfFile.get('/')
    const rootKeys = rootGroup.keys
    console.log(`root keys = ${rootKeys}`)

    // fetch named group
    console.log('fetching group /replicat10_chr1')
    const group = await hdfFile.get('/replica10_chr1')

    // Genomic positions dataset
    const genomicPosition = await group.get('genomic_position')
    const gpValues = await genomicPosition.value
    console.log(`genomic_position: # of elements = ${gpValues.length}  first = ${gpValues[0]}  last = ${gpValues[gpValues.length - 1]}`)

    // fetch spatial position group

    console.log('fetching child group "spatial_position"')
    const spatialPosition = await group.get('spatial_position')

    // Spatial position keys (1 for each dataset)
    const keys = spatialPosition.keys
    console.log(`# of spatial_position datasets = ${spatialPosition.keys.length}`)

    // first dataset
    console.log('fetching dataset')
    const sp1 = await spatialPosition.get(keys[0])
    const s1 = await sp1.shape
    const t1 = await sp1.dtype
    const values1 = await sp1.value
    console.log(`dataset ${keys[0]}: shape = ${s1}, type = ${t1}, # of elements = ${values1.length}`)
})()

