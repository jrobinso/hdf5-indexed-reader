import isNode from "./isNode.js"

let fs
if (isNode) {
    fs = require('fs')
} else {
    fs = {
        openSync: () => {throw Error("NodeLocalFile only supported in node.js environments")},
        readSync: () => {throw Error("NodeLocalFile only supported in node.js environments")},
        statSync: () => {throw Error("NodeLocalFile only supported in node.js environments")},
    }
}

class NodeLocalFile {

    constructor(args) {
        this.path = args.path
    }


    async read(position, length) {

        //console.log(`${position} - ${position + length} (${length})`)

        const fd = fs.openSync(this.path, 'r')
        position = position || 0
        length = length || fs.statSync(this.path).size
        const buffer = Buffer.alloc(length)
        const bytesRead = fs.readSync(fd, buffer, 0, length, position)

        fs.close(fd, function (error) {
            // TODO Do something with error
        })

        //TODO -- compare result.bytesRead with length
        const arrayBuffer = buffer.buffer
        return arrayBuffer
    }
}

export default NodeLocalFile
