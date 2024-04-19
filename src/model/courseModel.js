const { pgTable, serial, varchar, integer } = require('drizzle-orm/pg-core');

const courses = pgTable('courses', {
    id: serial('course_id').primaryKey(),
    name: varchar('name').notNull(),
    category: varchar('category').notNull(),
    level: integer('level').notNull()
});

module.exports = {courses}; 