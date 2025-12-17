import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  json,
  vector,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  uploadPostSynced: boolean('upload_post_synced').notNull().default(false),
});

export const shopifyIntegrations = pgTable('shopify_integrations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  shopUrl: varchar('shop_url', { length: 255 }).notNull(),
  accessToken: text('access_token').notNull(),
  scope: text('scope').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const brandSettings = pgTable('brand_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id)
    .unique(),
  brandName: varchar('brand_name', { length: 255 }),
  brandUrl: varchar('brand_url', { length: 255 }),
  brandLogo: text('brand_logo'),
  brandColors: text('brand_colors'), // Stored as JSON string
  brandVoice: varchar('brand_voice', { length: 255 }),
  brandAudience: text('brand_audience'),
  brandIndustry: varchar('brand_industry', { length: 255 }),
  brandValues: text('brand_values'),
  brandStory: text('brand_story'),
  brandImages: text('brand_images'), // Stored as JSON string
  
  // Deep Brand Understanding
  brandTagline: text('brand_tagline'),
  brandMission: text('brand_mission'),
  brandArchetype: varchar('brand_archetype', { length: 255 }),
  brandUniqueSellingPoints: text('brand_usps'), // JSON array
  brandPainPoints: text('brand_pain_points'), // JSON array
  brandCustomerDesires: text('brand_customer_desires'), // JSON array
  adAngles: text('ad_angles'), // JSON array
  socialMediaHandles: text('social_media_handles'), // JSON object
  
  // Content Matrix for efficient template population
  contentMatrix: json('content_matrix'), // Stores pre-generated brand assets (headlines, ctas, etc.)

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const brandProducts = pgTable('brand_products', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id')
    .notNull()
    .references(() => brandSettings.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: varchar('price', { length: 50 }),
  imageUrl: text('image_url'),
  productUrl: text('product_url'),
  metadata: text('metadata'), // JSON string
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
  credits: integer('credits').notNull().default(0),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  role: varchar('role', { length: 50 }).notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedBy: integer('invited_by')
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email'>;
  })[];
};

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}

export const templates = pgTable('templates', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  htmlTemplate: text('html_template'), // Made optional as we move to JSON-based storage
  cssTemplate: text('css_template'),   // Made optional as we move to JSON-based storage
  llmSchema: json('llm_schema').notNull(), // Minified JSON schema for LLM
  elements: json('elements'), // The new source of truth: Array of VisualElement
  visualEditorData: json('visual_editor_data'), // Legacy/Backup
  variables: json('variables'), // Default variable values (colors, text, images)
  semanticTags: json('semantic_tags'), // Array of strings
  category: varchar('category', { length: 50 }),
  platform: json('platform'), // Array of strings: ["instagram", "linkedin"]
  thumbnailUrl: text('thumbnail_url'),
  previewUrl: text('preview_url'),
  isPublic: boolean('is_public').default(false),
  isActive: boolean('is_active').default(true),
  width: integer('width'),
  height: integer('height'),
  usageCount: integer('usage_count').default(0),
  thumbsUpCount: integer('thumbs_up_count').default(0),
  thumbsDownCount: integer('thumbs_down_count').default(0),
  
  // AI Composition Fields
  isMasterLayout: boolean('is_master_layout').default(false), // Pre-designed templates for AI starting point
  layoutArchetype: varchar('layout_archetype', { length: 100 }), // 'social-proof-stack', 'feature-anatomy', etc.
  sectionComposition: json('section_composition'), // Array of section IDs: ['hero-impact-overlay', 'bridge-review-card']
  compositionRules: json('composition_rules'), // AI rules: { minSections: 2, maxSections: 5, requiredCategories: ['hero'] }
  intentMapping: json('intent_mapping'), // { primary: 'product-launch', secondary: ['social-proof', 'conversion'] }
  brandDnaCompatibility: json('brand_dna_compatibility'), // { archetypes: [...], industries: [...], tones: [...] }
  usageGuidance: text('usage_guidance'), // Human-readable AI prompt context
  aiGenerationPrompt: text('ai_generation_prompt'), // System prompt for AI to populate this template
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const templateEmbeddings = pgTable('template_embeddings', {
  id: serial('id').primaryKey(),
  templateId: text('template_id')
    .notNull()
    .references(() => templates.id, { onDelete: 'cascade' }),
  embedding: vector('embedding', { dimensions: 1536 }), // OpenAI text-embedding-3-small
  sourceText: text('source_text'), // Text used to generate embedding
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const templatesRelations = relations(templates, ({ many }) => ({
  embeddings: many(templateEmbeddings),
}));

export const templateEmbeddingsRelations = relations(templateEmbeddings, ({ one }) => ({
  template: one(templates, {
    fields: [templateEmbeddings.templateId],
    references: [templates.id],
  }),
}));

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
export type TemplateEmbedding = typeof templateEmbeddings.$inferSelect;
export type NewTemplateEmbedding = typeof templateEmbeddings.$inferInsert;

export const generatedTemplateValues = pgTable('generated_template_values', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  templateId: text('template_id')
    .notNull()
    .references(() => templates.id, { onDelete: 'cascade' }),
  values: json('values').notNull(), // The generated values matching llmSchema
  version: integer('version').default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const generatedTemplateValuesRelations = relations(generatedTemplateValues, ({ one }) => ({
  user: one(users, {
    fields: [generatedTemplateValues.userId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [generatedTemplateValues.templateId],
    references: [templates.id],
  }),
}));

export type GeneratedTemplateValue = typeof generatedTemplateValues.$inferSelect;
export type NewGeneratedTemplateValue = typeof generatedTemplateValues.$inferInsert;

export const templateSections = pgTable('template_sections', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // hero, features, footer, etc.
  html: text('html').notNull(),
  css: text('css').notNull(),
  variables: json('variables').default([]), // Array of variable names
  tags: text('tags').array(),
  thumbnailUrl: text('thumbnail_url'),
  isActive: boolean('is_active').default(true),
  
  // AI Selection Metadata
  metadata: json('metadata'), // { moods, purpose, density, compatibleEffects }
  intentKeywords: text('intent_keywords').array(), // ['launch', 'promo', 'story', 'tutorial']
  brandArchetypeMatch: text('brand_archetype_match').array(), // ['hero', 'sage', 'explorer']
  industryFit: text('industry_fit').array(), // ['ecommerce', 'saas', 'fashion', 'tech']
  platformOptimized: text('platform_optimized').array(), // ['instagram', 'linkedin', 'tiktok']
  contentType: varchar('content_type', { length: 50 }), // 'product', 'educational', 'social-proof', 'announcement'
  emotionalTone: text('emotional_tone').array(), // ['urgent', 'calm', 'playful', 'professional']
  conversionGoal: varchar('conversion_goal', { length: 50 }), // 'awareness', 'engagement', 'conversion', 'retention'
  aiScore: integer('ai_score').default(0), // AI-calculated quality score (0-100)
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type TemplateSection = typeof templateSections.$inferSelect;
export type NewTemplateSection = typeof templateSections.$inferInsert;

