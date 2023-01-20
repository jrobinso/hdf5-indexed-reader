import NodeLocalFile from "../src/io/nodeLocalFile"
import RemoteFile from "../src/io/remoteFile"
import {File} from "../src/high-level"
import fs from 'fs'

(async () => {
    if(process.argv.length > 2) {
        const path = process.argv[2]
        const output = (process.argv.length > 3) ? process.argv[3] : path + ".index.json"
        await makeIndex(path, output)
    } else {
        console.error("Path to hdf5 file required")
    }
})()


async function makeIndex(path, output) {

    const fileReader = (path.startsWith("http://") || path.startsWith("https:")) ?
        new RemoteFile({url: path}) :
        new NodeLocalFile({path: path})
    const buffer = await fileReader.read()
    const hdfFile = new File(buffer, path)
    await hdfFile.ready

    const rootGroup = await hdfFile.get('/')
    rootGroup.name = ''

    const index = {}
    await indexChildren(rootGroup, index)
    const json = JSON.stringify(index)

    try {
        fs.writeFileSync(output, json);
        // file written successfully
    } catch (err) {
        console.error(err);
    }
}

async function indexChildren(group, index) {

    const children = {}
    for(let key of group.keys) {
        //console.log(name)
        const childName = key
        const child = await group.get(key)
        const offset = child._dataobjects.offset
        children[childName] = offset
        if(child.keys && child.keys.length > 0) {
            await indexChildren(child, index)
        }
    }
    index[group.name] = children
    return children
}