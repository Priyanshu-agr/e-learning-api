const express = require('express');
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", userController.userList);

router.get("/:userId", verifyToken, userController.userDetailGet);

router.post("/", userController.userRegisterPost);

router.post("/login", userController.userLoginPost);

router.put("/:userId", verifyToken, userController.userUpdatePut);

router.delete("/:userId");

module.exports = router;