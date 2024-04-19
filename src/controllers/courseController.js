const db = require("../database/postgresConnect.js");
const { courses } = require("../model/courseModel.js");
const { eq, gt, and } = require("drizzle-orm");

const allCoursesList = async (req, res) => {
    const { category, level, cursor } = req.query;
    const pageSize = 1;
    const coursesList = async (cursor) => {
        return db.select().from(courses)
            .where(and(
                category ? eq(courses.category, category) : eq(courses.category, courses.category),
                level ? eq(courses.level, level) : eq(courses.level, courses.level)
            ))
            .where(cursor ? gt(courses.id, cursor) : eq(courses.id, courses.id))
            .limit(pageSize);
    };
    const courseData = await coursesList(cursor);
    const lastCourse = courseData[courseData.length - 1];
    const nextCursor = lastCourse.id;
    res.status(200).json({ "data": courseData, "cursor": nextCursor });
};

const courseReadGet = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await db.select().from(courses).where(eq(courses.id, courseId));
        if (course) {
            res.status(200).json({ data: course });
        }
        else {
            res.status(404).json({ message: "No course with given id exists" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
};

const courseCreatePost = async (req, res) => {
    await db.insert(courses).values(req.body);
    res.status(201).json({ message: "Course created successfully!" });
};

const courseUpdatePut = async (req, res) => {
    const { courseId } = req.params;
    await db.update(courses).set(req.body)
        .where(eq(courses.id, courseId));
    res.status(200).json({ message: "Course updated successfully" });
};

const courseDeleteDelete = async (req, res) => {
    const { courseId } = req.params;
    await db.delete(courses).where(eq(courses.id, courseId));
    res.status(200).json({ message: "Course deleted successfully" });
};

module.exports = { allCoursesList, courseReadGet, courseCreatePost, courseUpdatePut, courseDeleteDelete };


