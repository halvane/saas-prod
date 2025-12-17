ALTER TABLE "templates" ALTER COLUMN "html_template" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ALTER COLUMN "css_template" DROP NOT NULL;--> statement-breakpoint
-- ALTER TABLE "templates" ADD COLUMN "elements" json;