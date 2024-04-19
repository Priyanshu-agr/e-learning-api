const db = require("../database/postgresConnect.js");
const { users } = require("../model/userModel.js");
const { eq } = require("drizzle-orm");
const bcrypt = require("bcrypt");
const generateAccessToken = require("../utils/jwt.js");

const saltRounds = 10;

const userList = async (req, res) => {
    const usersList = await db.select().from(users);
    res.send(usersList);
};

const userDetailGet = async (req, res) => {
    const { userId } = req.params;
    if (req.userId != userId) {
        res.status(401).json({ message: "User id does not match with token" });
    }
    else {
        const user = await db.select().from(users).where(eq(users.id, userId));
        res.status(200).json({ data: user[0] });
    }
};

const userRegisterPost = async (req, res) => {
    const { emailId, password } = req.body;
    if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
        return res.status(403).json({ message: "Password must be at least 12 characters and include uppercase, lowercase, numbers, and symbols" });
    }
    const user = await db.select().from(users).where(eq(users.emailId, emailId));
    if (user.length) {
        res.status(403).json({ message: "User with give email id already exists" });
    }
    const hash = await bcrypt.hash(password, saltRounds);
    req.body.password = hash;
    await db.insert(users).values(req.body);
    res.status(201).json({ message: "User Registered Successfully" });
}

const userLoginPost = async (req, res) => {
    const { emailId, password } = req.body;
    const user = await db.select().from(users).where(eq(users.emailId, emailId));
    if (user.length) {
        const match = await bcrypt.compare(password, user[0].password);
        if (match) {
            const token = generateAccessToken({ userId: user[0].id });
            res.status(200).json({ token });
        }
        else {
            res.status(401).json({ message: "Authentication failed: Wrong password" });
        }
    }
    else {
        res.status(401).json({ message: "Authentication failed: No user found with given email id" });
    }
}

const userUpdatePut = async (req, res) => {
    await db.update(users).set(req.body)
        .where(eq(users.emailId, req.params.userId));
    res.status(200).json({ message: "User information updated successfully" });
};

module.exports = { userList, userDetailGet, userUpdatePut, userRegisterPost, userLoginPost };