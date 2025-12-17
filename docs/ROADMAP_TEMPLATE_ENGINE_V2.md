# 🚀 Viral Loop Engine: Template System V2 Roadmap

This roadmap outlines the next steps to fully operationalize the **"Iron Grid" Safety System**, **Refactored Sections**, and **Effects Registry**.

## 🗺️ High-Level Overview

| Phase | Focus Area | Status | Description |
|-------|------------|--------|-------------|
| **Phase 1** | **Builder UI Integration** | 🔲 Pending | Connect the new `SECTIONS` library to the visual editor. |
| **Phase 2** | **AI Generation Engine** | 🔲 Pending | Update LLM to assemble sections & fill variables instead of writing HTML. |
| **Phase 3** | **Brand DNA System** | 🔲 Pending | Connect user brand settings (colors/fonts) to the CSS variables. |
| **Phase 4** | **Export & Rendering** | 🔲 Pending | Generate standalone HTML/Images from the Tailwind-based templates. |

---

##  Phase 1: Builder UI Integration 🛠️
**Goal:** Make the refactored sections usable in the manual editor.

### 1.1. Section Picker Sidebar
- [ ] Create a sidebar component that iterates through `SECTIONS` (from `lib/builder/library.ts`).
- [ ] Group by `category` (Header, Hero, Text, etc.).
- [ ] Render thumbnail previews (using the `html` property scaled down).

### 1.2. Canvas Renderer
- [ ] Update the main canvas to render the list of selected sections.
- [ ] Implement "Stacking Logic" (calculating `top` positions based on previous section heights).
- [ ] Add "Remove" and "Move Up/Down" controls for each section.

### 1.3. Variable Editor (The "Smart Form")
- [ ] Create a dynamic form sidebar that changes based on the selected section.
- [ ] Parse `variables` from the section definition.
- [ ] Render inputs:
    - Text inputs for strings (`{{title}}`).
    - Image uploaders for URLs (`{{bg_image}}`).
    - Color pickers for overrides.

---

## Phase 2: AI Generation Engine V2 🧠
**Goal:** Switch AI from "writing code" to "assembling lego blocks".

### 2.1. Prompt Engineering Update
- [ ] Modify `lib/ai/templates/generation.ts`.
- [ ] **New Task:** Instead of "Write HTML", the task is "Select Section IDs and generate JSON for variables".
- [ ] **Output Format:**
  ```json
  {
    "layout": ["header-simple", "hero-modern", "features-grid", "footer-minimal"],
    "content": {
      "hero-modern": { "headline": "...", "cta": "..." },
      "features-grid": { "feat1_title": "..." }
    }
  }
  ```

### 2.2. Context Injection
- [ ] Feed the AI the list of available `SECTIONS` (metadata only: ID, Name, Purpose, Moods).
- [ ] Pass the User's Brand Persona (Archetype, Tone) to guide content generation.

### 2.3. Assembly Logic
- [ ] Create a helper `assembleTemplate(aiResponse)` that merges the static HTML from `SECTIONS` with the dynamic content from AI.

---

## Phase 3: Brand DNA Connection 🎨
**Goal:** Ensure the `var(--brand-primary)` variables actually work.

### 3.1. Dynamic Style Injection
- [ ] Create a `<BrandStyles />` component.
- [ ] Fetch `brand_settings` from DB.
- [ ] Generate a `<style>:root { ... }</style>` block injecting:
    - `--brand-primary`
    - `--brand-secondary`
    - `--brand-accent`
    - `--font-heading`
    - `--font-body`

### 3.2. Font Loader
- [ ] Integrate `next/font` or Google Fonts.
- [ ] Dynamically load the fonts specified in Brand DNA.

---

## Phase 4: Export & Rendering 📤
**Goal:** Turn the builder state into shareable assets.

### 4.1. Standalone HTML Export
- [ ] Create a utility to "bake" the Tailwind classes into standard CSS (or use a CDN link for preview).
- [ ] Ensure `globals.css` safety rules (`.safe-text`, etc.) are included in the export.

### 4.2. Image Generation (Social Media Posts)
- [ ] Use `vercel/og` or Puppeteer to screenshot the generated HTML.
- [ ] Support different aspect ratios (Square, Portrait) by resizing the container.

---

## Phase 5: Quality Assurance 🛡️
**Goal:** Verify the "Iron Grid" holds up.

### 5.1. Stress Testing
- [ ] Create a "Chaos Monkey" script that injects 500-character strings into all variables.
- [ ] Verify that `.line-clamp` and `.safe-text` prevent layout breakage.

### 5.2. Contrast Verification
- [ ] Automated check to ensure text over images uses the `.auto-contrast-dark` class or has sufficient contrast.
