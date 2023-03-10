import fs from "fs"

class NodeLocalFile {

    constructor(args) {
        this.path = args.path
    }

    async read(position, length) {

        //console.log(`${position} - ${position + length} (${length})`)

        if(length === 0) {
            return new ArrayBuffer(0)
        }

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
