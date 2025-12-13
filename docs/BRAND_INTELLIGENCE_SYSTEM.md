# Brand Intelligence System

## Overview
The Brand Intelligence System is a powerful module designed to extract, analyze, and store deep strategic information about a brand from its website URL. This system goes beyond simple metadata scraping to understand the brand's archetype, mission, unique selling points (USPs), customer pain points, and product catalog.

## Key Features

### 1. Deep Web Scraping
- **Technology**: Uses `cheerio` for robust HTML parsing.
- **Capabilities**:
  - Extracts metadata (title, description, keywords).
  - Parses Schema.org JSON-LD data for structured product information.
  - Identifies social media links.
  - Extracts brand colors and logos.
  - Scrapes product details (name, price, image, description) from e-commerce pages.

### 2. AI Strategic Analysis
- **Technology**: OpenAI GPT-4o-mini.
- **Analysis**:
  - **Brand Archetype**: Identifies the brand's persona (e.g., Hero, Sage, Creator).
  - **Mission Statement**: Distills the core purpose of the brand.
  - **USPs**: Identifies unique selling propositions.
  - **Customer Pain Points**: Analyzes problems the brand solves.
  - **Marketing Angles**: Generates high-converting ad angles.
  - **Tone & Voice**: Determines the communication style.

### 3. Structured Data Storage
- **Database**: PostgreSQL with Drizzle ORM.
- **Tables**:
  - `brand_settings`: Stores high-level brand identity and deep strategic JSON data.
  - `brand_products`: Stores structured product catalog linked to the brand.

## Data Structure

### Brand Settings (`brand_settings`)
| Field | Type | Description |
|-------|------|-------------|
| `brandArchetype` | String | The brand's persona (e.g., "The Explorer") |
| `brandMission` | String | Core mission statement |
| `brandTagline` | String | Primary slogan or tagline |
| `brandUsps` | JSON Array | List of Unique Selling Points |
| `brandPainPoints` | JSON Array | List of customer problems solved |
| `customerDesires` | JSON Array | List of target audience desires |
| `adAngles` | JSON Array | Strategic marketing angles |

### Brand Products (`brand_products`)
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Product name |
| `description` | String | Product description |
| `price` | String | Price string (e.g., "$29.99") |
| `imageUrl` | String | URL of the product image |
| `productUrl` | String | URL of the product page |
| `metadata` | JSON | Additional structured data |

## Usage

### API Endpoint
`POST /api/brand/scrape`
- **Input**: `{ "url": "https://example.com" }`
- **Output**: JSON object containing scraped data, AI analysis, and products.

### UI Component
The `SettingsPage` (`components/custom/Pages/SettingsPage.tsx`) provides a user interface to:
1. Input a website URL.
2. Trigger the analysis.
3. View and edit the extracted data.
4. Save the intelligence to the database.

## Future Improvements
- **Competitor Analysis**: Compare the brand against top competitors.
- **Ad Copy Generation**: Automatically generate ad copy based on the extracted angles.
- **Visual Style Analysis**: Use computer vision to analyze brand imagery style.
