CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"nickname" varchar(32),
	"email" varchar(64) NOT NULL,
	"password" varchar(128) NOT NULL,
	"telephone" varchar(16),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_telephone_unique" UNIQUE("telephone")
);
