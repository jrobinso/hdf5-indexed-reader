class BufferedFile2 {

    constructor(args) {
        this.file = args.file
        this.size = args.size || 16000
        this.buffers = []
        this.maxBuffersLength = 1
    }

    async read(position, length) {

        if (length > this.size) {
            // Request larger than max buffer size,  pass through to underlying file
            //console.log("0")
            return this.file.read(position, length)
        }

        let buffer = this.findBuffer(position, length)

        if (buffer) {
            const start = position
            const bufferStart = buffer.start
            const sliceStart = start - bufferStart
            const sliceEnd = sliceStart + length
            return buffer.slice(sliceStart, sliceEnd)

        } else {
            // No overlap with any existing buffer

            const bufferStart = Math.max(0, position - 10)
            const bufferData = await this.file.read(bufferStart, this.size)
            const bufferLength = bufferData.byteLength
            buffer = new Buffer(bufferStart, bufferLength, bufferData)
            this.addBuffer(buffer)

            const sliceStart = position - bufferStart
            const sliceEnd = sliceStart + length
            return buffer.slice(sliceStart, sliceEnd)
        }

    }

    addBuffer(buffer) {
        if (this.buffers.length > this.maxBuffersLength) {
            this.buffers = this.buffers.slice(1)
        }
        this.buffers.push(buffer)
    }

    findBuffer(start, length) {
        for (let buffer of this.buffers) {
            if (buffer.contains(start, start + length)) {
                return buffer
            }
        }
        // for (let buffer of this.buffers) {
        //     if (buffer.overlaps(start, start + length)) {
        //         return buffer
        //     }
        // }
        return undefined
    }


}

class Buffer {

    constructor(bufferStart, bufferLength, buffer) {
        this.start = bufferStart
        this.length = bufferLength
        this.end = bufferStart + bufferLength
        this.buffer = buffer
    }

    slice(start, end) {
        return this.buffer.slice(start, end)
    }

    contains(start, end) {
        return start >= this.start && end <= this.end
    }

    overlaps(start, end) {
        return (start > this.start && start < this.end) || (end > this.start && end < this.end)
    }

}

/**
 * concatenates 2 array buffers.
 * Credit: https://gist.github.com/72lions/4528834
 *
 * @private
 * @param {ArrayBuffers} buffer1 The first buffer.
 * @param {ArrayBuffers} buffer2 The second buffer.
 * @return {ArrayBuffers} The new ArrayBuffer created out of the two.
 */
var concatBuffers = function (buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
    tmp.set(new Uint8Array(buffer1), 0)
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength)
    return tmp.buffer
}


export default BufferedFile2