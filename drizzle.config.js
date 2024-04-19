require("dotenv").config();

const config = {
    schema: "./src/model/",
    out: "./drizzle",
    driver:"pg",
    dbCredentials:{
        connectionString:process.env.DATABASE_URL
    }
}

module.exports = config;