const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "test";

require("dotenv").config({
    path: `${dirname}/../.env.${ENV}`
});

if (!process.env.PGDATABASE && process.env.DATABASE_URL) {
    throw new Error("PGDATABASE not set");
}

const config = ENV === "test" ? {connectionString: process.env.DATABASE_URL, max:2} : {};

module.exports = new Pool(config);