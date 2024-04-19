        ALTER TABLE "enrollments" RENAME COLUMN "user_email" TO "user_id";--> statement-breakpoint
        ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_user_email_users_user_id_fk";
        --> statement-breakpoint
        ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_user_email_course_id_pk";--> statement-breakpoint
        ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_course_id_pk" PRIMARY KEY("user_id","course_id");--> statement-breakpoint
        DO $$ BEGIN
        ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
        EXCEPTION
        WHEN duplicate_object THEN null;
        END $$;
