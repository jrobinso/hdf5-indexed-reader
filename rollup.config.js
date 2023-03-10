
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
        input: 'src/index-node.js',
        output: [
            {file: 'dist/hdf5-indexed-reader.node.mjs', format: 'es'}
        ]
    },

    // Node cjs bundle
    {
        input: 'src/index-node.js',
        output: [
            {file: 'dist/hdf5-indexed-reader.node.cjs', format: 'cjs', name: 'openh5file'},
        ],

    }



];
