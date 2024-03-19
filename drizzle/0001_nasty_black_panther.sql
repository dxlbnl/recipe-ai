CREATE TABLE IF NOT EXISTS "recipes" (
	"slug" varchar NOT NULL,
	"name" varchar,
	"url" varchar,
	"rating" integer,
	"ingredients" jsonb,
	"steps" jsonb,
	CONSTRAINT "recipes_slug_unique" UNIQUE("slug")
);
