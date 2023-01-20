* hdf5-indexedReader

Module build on the jsfive project (https://github.com/usnistgov/jsfive) for efficient querying of HDF5 files over the
web. 

hdf5-indexedReader loads groups and datasets on demand as needed,  enabling support of large files that would 
overwhelm browser memory.  

The project's focus is on support of schemas with potentially many (10s of thousands or more) datasets.  Building
indeces for the datsets in such files can result in thousands of seeks over disparate regions of the file for small
amounts of data. The cost of such seeks for local files with fast disks are minimal, but for asynchronous
reading over the web the explosion of http requests can quickly freeze an application.  This project addresses this
issue by supporting an external index for the containers (groups and datasets) file offsets.  


Indexes can be built in nodes.js with the script ```makeIndex.js``` in the "scripts" folder.  Alternatively the
python project [h5-indexer](https://github.com/jrobinso/h5-indexer) can be used.


## Build

```
npm run install
npm run build
```

## Browser usage

```js
import {openH5File} from "dist/esm/hdf5.esm.js"

const hdfFile = await openH5File({
    indexURL: "./spleen_1chr1rep.cndb.index.json",
    url: "https://dl.dropboxusercontent.com/s/4ncekfdrlvkjjj6/spleen_1chr1rep.cndb?dl=0"
})

const rootGroup = await hdfFile.get('/')


```
