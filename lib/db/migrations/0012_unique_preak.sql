CREATE TABLE "generated_template_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"template_id" text NOT NULL,
	"values" json NOT NULL,
	"version" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "templates" ALTER COLUMN "variables" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_settings" ADD COLUMN "content_matrix" json;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "visual_editor_data" json;--> statement-breakpoint
ALTER TABLE "generated_template_values" ADD CONSTRAINT "generated_template_values_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_template_values" ADD CONSTRAINT "generated_template_values_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;