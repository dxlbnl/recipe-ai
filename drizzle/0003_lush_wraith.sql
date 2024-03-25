/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'recipes'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "recipes" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "slug" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_url_unique" UNIQUE("url");