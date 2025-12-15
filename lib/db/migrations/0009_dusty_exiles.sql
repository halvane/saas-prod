CREATE TABLE "template_embeddings" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" text NOT NULL,
	"embedding" vector(1536),
	"source_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"html_template" text NOT NULL,
	"css_template" text NOT NULL,
	"llm_schema" json NOT NULL,
	"semantic_tags" json,
	"category" varchar(50),
	"platform" json,
	"is_public" boolean DEFAULT false,
	"width" integer,
	"height" integer,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "template_embeddings" ADD CONSTRAINT "template_embeddings_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;