ALTER TABLE "template_sections" ADD COLUMN "metadata" json;--> statement-breakpoint
ALTER TABLE "template_sections" ADD COLUMN "intent_keywords" text[];--> statement-breakpoint
ALTER TABLE "template_sections" ADD COLUMN "brand_archetype_match" text[];--> statement-breakpoint
ALTER TABLE "template_sections" ADD COLUMN "industry_fit" text[];--> statement-breakpoint
ALTER TABLE "template_sections" ADD COLUMN "platform_optimized" text[];--> statement-breakpoint
ALTER TABLE "template_sections" ADD COLUMN "content_type" varchar(50);--> statement-breakpoint
ALTER TABLE "template_sections" ADD COLUMN "emotional_tone" text[];--> statement-breakpoint
ALTER TABLE "template_sections" ADD COLUMN "conversion_goal" varchar(50);--> statement-breakpoint
ALTER TABLE "template_sections" ADD COLUMN "ai_score" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "is_master_layout" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "layout_archetype" varchar(100);--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "section_composition" json;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "composition_rules" json;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "intent_mapping" json;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "brand_dna_compatibility" json;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "usage_guidance" text;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "ai_generation_prompt" text;