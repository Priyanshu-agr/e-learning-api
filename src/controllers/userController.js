const db = require("../database/postgresConnect.js");
const { users } = require("../model/userModel.js");
const { eq } = require("drizzle-orm");
const bcrypt = require("bcrypt");
const generateAccessToken = require("../utils/jwt.js");
const uploadImage = require("../utils/cloudinary.js");
const resendEmail = require("../utils/resend.js");

const saltRounds = 10;

const userList = async (req, res) => {
    try {
        const usersList = await db.select().from(users);
        res.send(usersList);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
};

const userDetailGet = async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.userId != userId) {
            res.status(401).json({ message: "User id does not match with token" });
        }
        else {
            const user = await db.select().from(users).where(eq(users.id, userId));
            res.status(200).json({ data: user[0] });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ messgae: err.message });
    }
};

const userRegisterPost = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
            return res.status(403).json({ message: "Password must be at least 12 characters and include uppercase, lowercase, numbers, and symbols" });
        }
        const user = await db.select().from(users).where(eq(users.emailId, emailId));
        if (user.length) {
            res.status(409).json({ message: "User with give email id already exists" });
        }
        const hash = await bcrypt.hash(password, saltRounds);
        req.body.password = hash;
        await db.insert(users).values(req.body);
        resendEmail(emailId, "Registartion Successful", "You have been successfully registered on the e-learning platform");
        res.status(201).json({ message: "User Registered Successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

const userLoginPost = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await db.select().from(users).where(eq(users.emailId, emailId));
        if (user.length) {
            const match = await bcrypt.compare(password, user[0].password);
            if (match) {
                const token = generateAccessToken({ userId: user[0].id });
                res.status(200).json({ data: token });
            }
            else {
                res.status(401).json({ message: "Authentication failed: Wrong password" });
            }
        }
        else {
            res.status(401).json({ message: "Authentication failed: No user found with given email id" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

const userImageUploadPost = async (req, res) => {
    try {
        const { imagePath } = req.body;
        const result = await uploadImage(imagePath, req.userId);
        await db.update(users).set({ imageURL: result.secure_url })
            .where(eq(users.id, req.userId));
        res.status(200).json({ data: result });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const userUpdatePut = async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.userId != userId) {
            res.status(401).json({ message: "User id does not match with token" });
        }
        await db.update(users).set(req.body)
            .where(eq(users.emailId, userId));
        res.status(200).json({ message: "User information updated successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const userDelete = async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.userId != userId) {
            res.status(401).json({ message: "User id does not match with token" });
        }
        await db.delete(users).where(eq(users.id, userId));
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}
module.exports = { userList, userDetailGet, userUpdatePut, userRegisterPost, userImageUploadPost, userLoginPost, userDelete };