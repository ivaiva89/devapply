CREATE TABLE "sign_in_lockout" (
	"email" text PRIMARY KEY NOT NULL,
	"failed_attempts" integer NOT NULL,
	"locked_until" timestamp with time zone
);
