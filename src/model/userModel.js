const { pgTable, varchar, pgEnum,serial} = require('drizzle-orm/pg-core');

const roleEnum = pgEnum('role',['user','superadmin']);

const users = pgTable('users', {
    id: serial('user_id').primaryKey(),
    emailId: varchar('email_id'),
    firstName: varchar('first_name', { length: 256 }).notNull(),
    lastName: varchar('last_name', { length: 256 }),
    password: varchar('password').notNull(),
    role: roleEnum('role').default('user')
});

module.exports = {users,roleEnum};      