import {unflattenIndex} from "../../dist/hdf5-indexed-reader.esm.js"

function createNodeMap(index, rootname) {

    const rootObject = unflattenIndex(index)

    const makeNode = (object) => {
        return {
            text: getName(object.name),
            children: object.children && object.children.length > 0,
            h5key: object.name,
            id: object.name
        }
    }

    const nodeMap = new Map()

    const addNodes = (object) => {
        if(object.children && object.children.length > 0) {
            const nodes = object.children.map( c => makeNode(c))
            nodeMap.set(object.name, nodes)
            for(let c of object.children) {
                addNodes(c)
            }
        }
    }

    nodeMap.set('#', [{
        text: rootname || "Root",
        children: true,
        id: '/',
        state: {opened: true},
    }])

    addNodes(rootObject)

    return nodeMap

}


function getName(path) {
    return path.substring(path.lastIndexOf('/') + 1)
}

export {createNodeMap}