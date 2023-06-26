const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "test";

require("dotenv").config({
    path: `${__dirname}/../.env.${ENV}`
});

if (!process.env.PGDATABASE && process.env.DATABASE_URL) {
    throw new Error("PGDATABASE not set");
}

const config = ENV === "production" ? {connectionString: process.env.DATABASE_URL, max:2} : {};
// As only test mode is being used, the ternary operator isn't required. 

module.exports = new Pool(config);