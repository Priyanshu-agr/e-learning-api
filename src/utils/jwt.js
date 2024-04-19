const jwt = require("jsonwebtoken");
require('dotenv').config();

const generateAccessToken = (userId)=>{
    return jwt.sign(userId,process.env.TOKEN_SECRET,{expiresIn:'4h'});
};

module.exports = generateAccessToken;