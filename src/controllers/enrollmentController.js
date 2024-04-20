const db = require("../database/postgresConnect.js");
const { enrollments } = require("../model/enrollmentModel.js");
const { users } = require("../model/userModel.js");
const { courses } = require("../model/courseModel.js");
const { eq } = require("drizzle-orm");
const resendEmail = require("../utils/resend.js");

const enrollCourseGet = async (req, res) => {
    try {
        const userId = req.userId;
        const courseIds = await db.select({
            field1: enrollments.courseId
        }).from(enrollments).where(
            eq(enrollments.userId, userId)
        );
        let result = [];
        for (let i = 0; i < courseIds.length; i++) {
            const course = await db.select().from(courses).where(
                eq(courses.id, courseIds[i].field1));
            result.push(course[0]);
        }
        res.status(200).json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

const courseEnrollPost = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;
        const user = await db.select().from(users).where(eq(users.id, userId));
        const course = await db.select().from(courses).where(eq(courses.id, courseId));
        await db.insert(enrollments).values({ userId: userId, courseId: courseId });
        console.log(user);
        resendEmail(user.emailId, "Course Registarion Successful", `Successfully enrolled in ${course.name}`)
        res.status(200).json({ message: "Successfully enrolled in course" });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

module.exports = { courseEnrollPost, enrollCourseGet }

