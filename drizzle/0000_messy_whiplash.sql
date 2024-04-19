DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('user', 'superadmin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courses" (
	"course_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"category" varchar NOT NULL,
	"level" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "enrollments" (
	"user_email" integer,
	"course_id" integer,
	CONSTRAINT "enrollments_user_email_course_id_pk" PRIMARY KEY("user_email","course_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"email_id" varchar,
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256),
	"password" varchar NOT NULL,
	"role" "role" DEFAULT 'user'
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_email_users_user_id_fk" FOREIGN KEY ("user_email") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
