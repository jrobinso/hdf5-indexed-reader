# hdf5-indexed-reader

## Summary

Module built on the jsfive project (https://github.com/usnistgov/jsfive) for efficient querying of HDF5 files over the
web.   Runs in node and the browser (for browser build ```npm run build``` and import dist/hdf5-indexed-reader.esm.js).

hdf5-indexed-reader works in conjunction with hdf5 files indexed with the companion python project  
[h5-indexer](https://github.com/jrobinso/h5-indexer) to load groups and datasets on demand as needed,  enabling
support of large files that would overwhelm browser memory. The project's focus is on support of schemas with 
potentially many (10s of thousands or more) datasets.  Loading such files can result in 
thousands of seeks over disparate regions of the file to build the internal b-tree indeces. The cost of such seeks for local 
files with fast disks are minimal, but for asynchronous  reading over the web the explosion of http requests can 
quickly freeze an application.  This project addresses this  issue by supporting an external index for the containers 
(groups and datasets) file offsets.  


## Limitations

* As this project is based on [jsfive](https://github.com/usnistgov/jsfive),  Some limitations of that tool apply here,
namely not all datatypes that are supported. However common data formats including numeric and string datatypes
are.  


* The hdf5 file is indexed at the granulatiry of containers, i.e. groups and datasets, and these are the smallest addressable
objects.  Although not a problem for node,  hdf5 files with very large datasets will likely not be loadable in the browser.
The focus of the project is on schemas with many small datasets, as opposed to a few (or many) large datasets. Depending
on your internet speed, computer memory, and patience, the threshold between small and large can range from one to
a few hundred MB.



## Build

```
npm run install
npm run build
```

## Browser usage

```js
import {openH5File} from "dist/esm/hdf5-indexed-reader.esm.js"

const hdfFile = await openH5File({
    url: "https://www.dropbox.com/s/53fbs3le4a65noq/spleen_1chr1rep.indexed.cndb?dl=0",
})

const rootGroup = await hdfFile.get('/')


```
