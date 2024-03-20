CREATE TABLE IF NOT EXISTS "recipes" (
	"slug" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"url" varchar,
	"rating" integer,
	"ingredients" jsonb,
	"steps" jsonb
);
