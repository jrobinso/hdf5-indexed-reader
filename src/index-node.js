import NodeLocalFile from "./io/nodeLocalFile.js"
import { openH5File as _openH5File } from "./open.js"

/**
 * Override openH5File to support local file reading with node 'fs'*
 *
 * @param options
 * @returns {Promise<File>}
 */
async function openH5File(options) {

    if (options.path) { // A file path
        options.reader = new NodeLocalFile(options)
            }

    if (options.indexPath) {
        options.indexReader = new NodeLocalFile({path: options.indexPath})
            }

    return _openH5File(options)
}

export {openH5File}
export {unflattenIndex} from "./utils.js"
