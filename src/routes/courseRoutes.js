const express = require("express");
const courseController = require("../controllers/courseController");
const { verifyToken, verifySuperAdmin } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", courseController.allCoursesList);

router.get("/:courseId", verifyToken, verifySuperAdmin, courseController.courseReadGet);

router.post("/", verifyToken, verifySuperAdmin, courseController.courseCreatePost);

router.put("/:courseId", verifyToken, verifySuperAdmin, courseController.courseUpdatePut);

router.delete("/:courseId", verifyToken, verifySuperAdmin, courseController.courseDeleteDelete);

module.exports = router;