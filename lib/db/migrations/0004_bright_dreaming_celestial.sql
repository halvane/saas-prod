CREATE TABLE "brand_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" varchar(50),
	"currency" varchar(10),
	"url" text,
	"images" text,
	"features" text,
	"benefits" text,
	"ad_angles" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brand_settings" ADD COLUMN "brand_tagline" text;--> statement-breakpoint
ALTER TABLE "brand_settings" ADD COLUMN "brand_mission" text;--> statement-breakpoint
ALTER TABLE "brand_settings" ADD COLUMN "brand_archetype" varchar(50);--> statement-breakpoint
ALTER TABLE "brand_settings" ADD COLUMN "brand_usps" text;--> statement-breakpoint
ALTER TABLE "brand_settings" ADD COLUMN "brand_pain_points" text;--> statement-breakpoint
ALTER TABLE "brand_settings" ADD COLUMN "brand_customer_desires" text;--> statement-breakpoint
ALTER TABLE "brand_settings" ADD COLUMN "social_media_handles" text;--> statement-breakpoint
ALTER TABLE "brand_products" ADD CONSTRAINT "brand_products_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;