const jwt = require("jsonwebtoken");
const db = require("../database/postgresConnect.js");
const { users } = require("../model/userModel.js");
const { eq } = require("drizzle-orm");
require("dotenv").config;

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Missign JWT token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

const verifySuperAdmin = async (req, res, next) => {
    try {
        const user = await db.select().from(users).where(eq(users.id, req.userId));
        if (user[0].role === 'superadmin') {
            next();
        }
        else {
            res.status(403).json({ message: "Unauthorized: Access Not allowed" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "error" });
    }
};

module.exports = { verifyToken, verifySuperAdmin };