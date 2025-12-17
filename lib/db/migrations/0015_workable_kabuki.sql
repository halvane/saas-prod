CREATE TABLE "template_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(50) NOT NULL,
	"html" text NOT NULL,
	"css" text NOT NULL,
	"variables" json DEFAULT '[]'::json,
	"tags" text[],
	"thumbnail_url" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brand_settings" DROP COLUMN "brand_font";