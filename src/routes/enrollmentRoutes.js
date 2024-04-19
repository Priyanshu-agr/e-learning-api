const express = require("express");
const enrollmentController = require("../controllers/enrollmentController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, enrollmentController.enrollCourseGet);
router.post("/:courseId", verifyToken, enrollmentController.courseEnrollPost);

module.exports = router;

