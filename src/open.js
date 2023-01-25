import RemoteFile from "./io/remoteFile.js"
import BufferedFile from "./io/bufferedFile.js"
import NodeLocalFile from "./io/nodeLocalFile.js"
import BrowserLocalFile from "./io/browserLocalFile.js"
import {File, Group} from "./jsfive/index.mjs"

async function openH5File(options) {

    let indexReader
    let index
    let filename
    if (options.indexURL) {
        indexReader = new RemoteFile({url: options.indexURL})
        filename = getFilename(options.indexURL)
    } else if (options.indexPath) {
        indexReader = new NodeLocalFile({path: options.indexPath})
        filename = getFilename(options.indexPath)
    } else if (options.indexFile) {
        indexReader = new BrowserLocalFile({file: options.file})
        filename = options.file.name
    }
    if (indexReader) {
        const indexFileContents = await indexReader.read()
        const indexFileJson = new TextDecoder().decode(indexFileContents)
        index = JSON.parse(indexFileJson)

    }

    let fileReader = getReaderFor(options)
    if (index) {
        fileReader = new BufferedFile({file: fileReader, size: 4000})
    }
    const asyncBuffer = new AsyncBuffer(fileReader)

    // Create HDF5 file
    const hdfFile = new File(asyncBuffer, filename, {index})
    await hdfFile.ready
    return hdfFile

}


function getReaderFor(options) {
    if (options.url) { // An absolute or relative URL
        return new RemoteFile(options)
    } else if (options.path) { // A file path
        return new NodeLocalFile(options)
    } else if (options.file) { // A Browser file blob
        return new BrowserLocalFile(options.file)
    } else {
        throw Error("One of 'url', 'path (node only)', or 'file (browser only)' must be specified")
    }
}

/**
 * Wraps an io.Reader in an interface jsfive-async expects*
 */
class AsyncBuffer {
    constructor(fileReader) {
        this.fileReader = fileReader
    }

    async slice(start, end) {
        return this.fileReader.read(start, end - start)
    }
}

function getFilename(pathOrURL) {
    const idx = pathOrURL.lastIndexOf("/")
    return idx > 0 ? pathOrURL.substring(idx + 1) : pathOrURL
}

export {openH5File}