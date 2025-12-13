CREATE TABLE "brand_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"brand_name" varchar(255),
	"brand_url" varchar(255),
	"brand_logo" text,
	"brand_colors" text,
	"brand_voice" varchar(50),
	"brand_audience" text,
	"brand_industry" varchar(100),
	"brand_values" text,
	"brand_story" text,
	"brand_images" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "brand_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "brand_settings" ADD CONSTRAINT "brand_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;