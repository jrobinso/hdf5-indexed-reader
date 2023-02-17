class BufferedFile3 {

    constructor(args) {
        this.file = args.file
        this.fetchSize = args.fetchSize || 16000
        this.maxSize = args.maxSize || 1000000
        this.buffers = []
    }

    async read(position, length) {


        let overlappingBuffers = this.buffers.filter( b => b.overlaps(position, position + length))

        // See if any buffers completely contain request, if so we're done
        for(let buffer of overlappingBuffers) {
            if(buffer.contains(position, position + length)) {
              return buffer.slice(position, position + length)
            }
        }


        if(overlappingBuffers.length === 0) {

            // No overlap with any existing buffer
            let size = Math.max(length, this.fetchSize)

            // Find index of first buffer to the right, if any, to potentially limit size
            this.buffers.sort((a, b) => a.start - b.start)
            const idx = binarySearch(this.buffers, (b) => b.start > position, 0)
            if(idx < this.buffers.length) {
                size = Math.min(size, this.buffers[idx].start - position)
            }

            const bufferStart = position
            const bufferData = await this.file.read(bufferStart, size)
            const buffer = new Buffer(bufferStart, bufferData)
            this.addBuffer(buffer)

            return buffer.slice(position, position + length)
        } else {

            // console.log("Cache hit")
            // Some overlap.   Fill gaps
            overlappingBuffers.sort((a, b) => a.start - b.start)
            const allBuffers = []
            let currentEnd = position
            for (let ob of overlappingBuffers) {
                if (currentEnd < ob.start) {
                    const bufferStart = currentEnd
                    const bufferSize = ob.start - currentEnd
                    const bufferData = await this.file.read(bufferStart, bufferSize)
                    const buffer = new Buffer(bufferStart, bufferData)
                    allBuffers.push(buffer)
                }
                allBuffers.push(ob)
                currentEnd = ob.end
            }

            // Check end
            const requestedEnd = position + length
            if (requestedEnd > currentEnd) {
                const bufferStart = currentEnd
                const bufferSize = requestedEnd - bufferStart
                const bufferData = await this.file.read(bufferStart, bufferSize)
                const buffer = new Buffer(bufferStart, bufferData)
                allBuffers.push(buffer)
            }

            const newStart = allBuffers[0].start
            const newArrayBuffer = concatArrayBuffers(allBuffers.map(b => b.buffer))
            const newBuffer = new Buffer(newStart, newArrayBuffer)

            // Replace the overlapping buffers with the new composite one
            const tmp = new Set(overlappingBuffers)
            this.buffers = this.buffers.filter(b => !tmp.has(b))
            this.addBuffer(newBuffer)

            return newBuffer.slice(position, position + length)
        }

    }

    addBuffer(buffer) {

        const size = this.buffers.reduce((a,b) => a + b.size, 0) + buffer.size
        if(size > this.maxSize) {
            // console.log(`max buffer size exceeded`)
            const overage = size - this.maxSize
            this.buffers.sort((a,b) => a.creationTime - b.creationTime)
            let sum = 0
            let i
            for(i=0; i<this.buffers.length; i++) {
                sum += this.buffers[i].size
                if(sum > overage) {
                    break
                }
            }
            // console.log('removing buffers')
            // for(let j=0; j<i; j++) console.log(`  ${this.buffers[j].toString()}`)
            this.buffers = (i < this.buffers.length - 1)  ? this.buffers.slice(i)  : []
        }

        if(buffer.size <= this.maxSize) {
            this.buffers.push(buffer)
        }
    }



}

class Buffer {

    constructor(bufferStart, buffer) {
        this.creationTime = Date.now()
        this.start = bufferStart
        this.buffer = buffer
    }

    slice(start, end) {
        if(start < this.start || end - start > this.buffer.byteLength) {
            throw Error("buffer bounds error")
        }
        return this.buffer.slice(start - this.start, end - this.start)
    }

    get end() {
        return this.start + this.buffer.byteLength
    }

    get size() {
        return this.buffer.byteLength
    }

    contains(start, end) {
        return start >= this.start && end <= this.end
    }

    overlaps(start, end) {
        return (start > this.start && start < this.end) || (end > this.start && end < this.end)
    }

    toString() {
        return `Buffer ${this.creationTime}   ${this.start} - ${this.end}`
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
function concatArrayBuffers(buffers) {
    const size = buffers.reduce((a,b) => a + b.byteLength, 0)
    const tmp = new Uint8Array(size)
    let offset = 0
    for(let b of buffers) {
        tmp.set(new Uint8Array(b), offset)
        offset += b.byteLength
    }
    return tmp.buffer
}

/**
 * Return 0 <= i <= array.length such that !pred(array[i - 1]) && pred(array[i]).
 *
 * returns an index 0 ≤ i ≤ array.length such that the given predicate is false for array[i - 1] and true for array[i]* *
 */
function binarySearch(array, pred, min) {
    let lo = min - 1, hi = array.length
    while (1 + lo < hi) {
        const mi = lo + ((hi - lo) >> 1)
        if (pred(array[mi])) {
            hi = mi
        } else {
            lo = mi
        }
    }
    return hi
}



export default BufferedFile3