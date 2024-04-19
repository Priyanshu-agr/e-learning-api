const { pgTable, integer, primaryKey } = require("drizzle-orm/pg-core");
const { users } = require("./userModel");
const { courses } = require("./courseModel");

const enrollments = pgTable('enrollments', {
    userId: integer('user_id').references(() => users.id),
    courseId: integer('course_id').references(() => courses.id)
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.userId, table.courseId] })
    };
});

module.exports = { enrollments };