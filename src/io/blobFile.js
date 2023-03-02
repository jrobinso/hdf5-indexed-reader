class BlobFile {

    constructor(blob) {
        this.file = blob
    }

    async read(position, length) {

        if(length === 0) {
            return new ArrayBuffer()
        }

        const blob = (position != undefined && length) ?
            this.file.slice(position, position + length) :
            this.file

        return blob.arrayBuffer()
    }
}

export default BlobFile;
