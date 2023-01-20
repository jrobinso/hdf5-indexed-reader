import isNode from "./isNode.js"

const crossFetch = isNode ? require("node-fetch") : fetch;

export default crossFetch;
