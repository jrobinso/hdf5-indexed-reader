
export default [

    // Browser ES6 bundle
    {
        input: 'src/index.js',
        output: [
            {file: 'dist/hdf5-indexed-reader.esm.js', format: 'es'}
        ]
    },

    // Node ES6 bundle
    {
        input: 'src/index.js',
        output: [
            {file: 'dist/hdf5-indexed-reader.node.mjs', format: 'es'}
        ]
    }

];
