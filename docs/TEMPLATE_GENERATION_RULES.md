# Template Generation Rules & Variable Naming Conventions

## Overview
This document outlines the rules for generating HTML/CSS templates that are compatible with the **Content Matrix System**. 
The system uses a "Generate Once, Map Many" approach, where brand content is generated in bulk and then mapped to templates based on variable names.

**CRITICAL:** To ensure your template is populated correctly, you MUST use variable names that match the patterns below.

## Variable Naming Conventions

When defining the `llmSchema` or `variables` JSON for a template, use keys that contain the following keywords. The system uses fuzzy matching (regex), so `headline_1`, `mainTitle`, and `hero_heading` will all map to the **Headlines** category.

### 1. Headlines & Titles
*Use for: Main headings, hero titles, article titles.*
- **Keywords:** `headline`, `title`, `heading`, `h1`, `hook`, `header`, `masthead`, `topic`, `subject`
- **Examples:** `heroHeadline`, `blogTitle`, `main_heading`, `hook_text`

### 2. Subtitles & Captions
*Use for: Supporting text, intros, summaries.*
- **Keywords:** `sub`, `caption`, `tagline`, `intro`, `desc`, `summary`, `bio`, `overview`
- **Examples:** `subheadline`, `heroSubtitle`, `imageCaption`, `introText`

### 3. Call to Action (CTA)
*Use for: Buttons, links, invites.*
- **Keywords:** `cta`, `button`, `action`, `join`, `rsvp`, `invite`, `click`
- **Examples:** `ctaText`, `buttonLabel`, `joinButton`, `rsvp_action`

### 4. Quotes & Testimonials
*Use for: Reviews, customer feedback, inspirational quotes.*
- **Keywords:** `quote`, `testimonial`, `review`, `speech`, `message`, `comment`, `author`, `customer`
- **Examples:** `userQuote`, `testimonialText`, `reviewBody`, `authorName`

### 5. Features & Benefits
*Use for: Bullet points, checklists, steps, ingredients.*
- **Keywords:** `feature`, `benefit`, `point`, `highlight`, `check`, `item`, `ingredient`, `tip`
- **Examples:** `feature1`, `keyBenefit`, `bulletPoint`, `checklist_item`

### 6. Statistics & Numbers
*Use for: Data points, ratings, percentages.*
- **Keywords:** `stat`, `number`, `value`, `count`, `rating`, `score`, `percent`, `amount`, `stars`
- **Examples:** `statValue`, `userCount`, `ratingScore`, `percentageOff`

### 7. Dates & Times
*Use for: Event dates, deadlines, schedules.*
- **Keywords:** `date`, `time`, `schedule`, `deadline`, `launch`, `duration`, `period`, `day`, `week`, `month`
- **Examples:** `eventDate`, `launchTime`, `deadlineDay`, `scheduleSlot`

### 8. Prices & Costs
*Use for: Pricing tables, discounts, fees.*
- **Keywords:** `price`, `cost`, `fee`, `discount`, `sale`, `offer`
- **Examples:** `productPrice`, `discountAmount`, `monthlyFee`

### 9. Contact Info & Locations
*Use for: Addresses, websites, social handles.*
- **Keywords:** `email`, `phone`, `website`, `address`, `location`, `handle`, `username`, `contact`, `site`, `link`
- **Examples:** `contactEmail`, `websiteUrl`, `socialHandle`, `storeLocation`

### 10. Steps & Process
*Use for: Numbered steps, phases.*
- **Keywords:** `step`, `phase`, `module`
- **Examples:** `step1Title`, `phaseName`

### 11. Questions
*Use for: Engagement questions, FAQs.*
- **Keywords:** `question`, `ask`, `query`
- **Examples:** `faqQuestion`, `engagementAsk`

### 12. Images
*Use for: Backgrounds, product shots, logos, icons.*
- **Keywords:** `image`, `photo`, `bg`, `background`, `logo`, `icon`, `avatar`, `picture`, `img`, `thumbnail`, `cover`, `screenshot`
- **Specific Mapping:**
    - `logo` -> Brand Logo
    - `product`, `item`, `book`, `cover` -> Product Images
    - `bg`, `background`, `hero` -> General Brand Images (or Product Images if none)
- **Examples:** `heroImage`, `productPhoto`, `brandLogo`, `backgroundImage`

### 13. Body Text (Fallback)
*Use for: General paragraphs, descriptions.*
- **Keywords:** `body`, `text`, `content`, `paragraph`, `note`, `info`
- **Examples:** `bodyText`, `mainContent`, `infoParagraph`

---

## Example Template Schema

```json
{
  "id": "modern-promo-01",
  "name": "Modern Promo",
  "llmSchema": {
    "heroHeadline": "Main catchy title",
    "subheadline": "Supporting text",
    "ctaButton": "Button text",
    "feature1": "First key point",
    "feature2": "Second key point",
    "priceLabel": "Price tag",
    "websiteUrl": "Link to site"
  }
}
```

## Best Practices
1.  **Be Descriptive:** Use `heroHeadline` instead of just `text1`.
2.  **Use English:** The mapping logic is based on English keywords.
3.  **Avoid Ambiguity:** Don't use `text` for a headline. Use `headline` or `title`.
4.  **Group Related Items:** If you have a list, use `feature1`, `feature2`, `feature3`.

## System Behavior
If a variable name does not match any of the specific categories above, the system will default to filling it with **Body Text**. This ensures no field is left empty, but specific matching yields much better results.
