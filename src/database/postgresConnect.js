const { neon } = require("@neondatabase/serverless")
const { drizzle } = require("drizzle-orm/neon-http");
const { users } = require("../model/userModel");
const { courses } = require("../model/courseModel");
const { enrollments } = require("../model/enrollmentModel");
require("dotenv").config();

const sql = neon(process.env.DATABASE_URL );

const db = drizzle(sql, { schema: { users, courses, enrollments } });

module.exports = db;           
