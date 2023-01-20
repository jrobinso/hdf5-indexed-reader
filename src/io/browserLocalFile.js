class BrowserLocalFile {

    constructor(blob) {
        this.file = blob
    }

    async read(position, length) {

        const blob = (position != undefined && length) ?
            this.file.slice(position, position + length) :
            this.file

        return blob.arrayBuffer()
    }
}

export default BrowserLocalFile;
