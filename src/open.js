import RemoteFile from "./io/remoteFile.js"
import BufferedFile from "./io/bufferedFile.js"
import NodeLocalFile from "./io/nodeLocalFile.js"
import BrowserLocalFile from "./io/browserLocalFile.js"
import {File, Group} from "./jsfive/index.mjs"

async function openH5File(options) {

    let hasIndex = false
    let indexReader
    if (options.indexURL) {
        indexReader = new RemoteFile({url: options.indexURL})
    } else if (options.indexPath) {
        indexReader = new NodeLocalFile({path: options.indexPath})
    } else if (options.indexFile) {
        indexReader = new BrowserLocalFile({file: options.file})
    }
    if (indexReader) {
        const indexFileContents = await indexReader.read()
        const indexFileJson = new TextDecoder().decode(indexFileContents)
        const index = JSON.parse(indexFileJson)

        Group.prototype.init = async function(dataobjects) {
            if(index && this.name in index) {
                this._links = index[this.name]
            } else {
                this._links = await dataobjects.get_links();
            }
            this._dataobjects = dataobjects;
            this._attrs = null;  // cached property
            this._keys = null;
        }
        hasIndex = true
    }

    let fileReader = getReaderFor(options)
    if (hasIndex) {
        fileReader = new BufferedFile({file: fileReader})
    }
    const asyncBuffer = new AsyncBuffer(fileReader)

    // Create HDF5 file
    const hdfFile = new File(asyncBuffer, "spleen_1chr1rep.cndb")
    await hdfFile.ready
    return hdfFile

}


function getReaderFor(options) {
    if (options.url) { // An absolute or relative URL
        return new RemoteFile(options)
    } else if (options.path) { // A file path
        return new NodeLocalFile(options)
    }  else if (options.file) { // A Browser file blob
        return new BrowserLocalFile(options.file)
    }else {
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




export {openH5File}