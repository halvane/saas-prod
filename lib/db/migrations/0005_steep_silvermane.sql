ALTER TABLE "brand_products" DROP CONSTRAINT "brand_products_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "brand_products" ADD COLUMN "brand_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_products" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "brand_products" ADD COLUMN "product_url" text;--> statement-breakpoint
ALTER TABLE "brand_products" ADD COLUMN "metadata" text;--> statement-breakpoint
ALTER TABLE "brand_products" ADD CONSTRAINT "brand_products_brand_id_brand_settings_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_products" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "brand_products" DROP COLUMN "currency";--> statement-breakpoint
ALTER TABLE "brand_products" DROP COLUMN "url";--> statement-breakpoint
ALTER TABLE "brand_products" DROP COLUMN "images";--> statement-breakpoint
ALTER TABLE "brand_products" DROP COLUMN "features";--> statement-breakpoint
ALTER TABLE "brand_products" DROP COLUMN "benefits";--> statement-breakpoint
ALTER TABLE "brand_products" DROP COLUMN "ad_angles";