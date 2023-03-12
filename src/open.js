import RemoteFile from "./io/remoteFile.js"
import BufferedFile from "./io/bufferedFile.js"
import BlobFile from "./io/blobFile.js"
import {File} from "../node_modules/jsfive/dist/esm/index.mjs"

async function openH5File(options) {

    // Some clients (notably igv-webapp) pass a File reference in the url field.  Fix this
    if(options.url && isBlobLike(options.url)) {
        options.file = options.url
        options.url = undefined
    }

    const isRemote = options.url !== undefined
    let fileReader = options.reader ? options.reader : getReaderFor(options)

    // Set default options appropriate for spacewalk
    const fetchSize = options.fetchSize || 2000
    const maxSize = options.maxSize || 200000

    if (isRemote) {
        fileReader = new BufferedFile({file: fileReader, fetchSize, maxSize})
    }
    const asyncBuffer = new AsyncBuffer(fileReader)

    // Optional external index -- this is not common
    const index = await readExternalIndex(options)
    const indexOffset = options.indexOffset

    // Create HDF5 file
    const filename = getFilenameFor(options)
    const hdfFile = new File(asyncBuffer, filename, {index, indexOffset})
    await hdfFile.ready
    return hdfFile
}

async function readExternalIndex(options) {

    let indexReader
    if(options.indexReader) {
        indexReader = options.indexReader
    }
    else if(options.index) {
        return options.index
    } else if (options.indexURL) {
        indexReader = new RemoteFile({url: options.indexURL})
    } else if (options.indexPath) {
        indexReader = new NodeLocalFile({path: options.indexPath})
    } else if (options.indexFile) {
        indexReader = new BlobFile({file: options.indexFile})
    }
    if (indexReader) {
        const indexFileContents = await indexReader.read()
        const indexFileJson = new TextDecoder().decode(indexFileContents)
        return JSON.parse(indexFileJson)
    } else {
        return undefined
    }
}


function getReaderFor(options) {
    if (options.url) { // An absolute or relative URL
        return new RemoteFile(options)
    } else if (options.path) { // A file path
        return new NodeLocalFile(options)
    } else if (options.file) { // A Browser file blob
        return new BlobFile(options.file)
    } else {
        throw Error("One of 'url', 'path (node only)', or 'file (browser only)' must be specified")
    }
}

function getFilenameFor(options) {
    if (options.url) {
        return getFilename(options.url)
    } else if (options.path) {
        return getFilename(options.path)
    } else if (options.file) {
        return options.file.name
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

function isBlobLike(obj) {
    return typeof obj.slice === 'function' && typeof obj.arrayBuffer === 'function'
}

export {openH5File}