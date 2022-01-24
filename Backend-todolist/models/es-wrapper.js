const { Client } = require("es5");
const client = new Client({ node: "http://localhost:9200" });

module.exports = client;