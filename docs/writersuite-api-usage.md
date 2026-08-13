# 🚀 WriterSuite Headless Content API Specification (`v1`)

Welcome to the **WriterSuite Tenant REST API** authoritative implementation specification. This document provides a complete, self-contained reference for engineers, frontend developers (Astro, Next.js, Nuxt, Remix, Mobile), and LLM coding assistants building Headless publication frontends powered by WriterSuite.

---

## 📑 Table of Contents
1. [Architecture & Tenant Isolation](#1-architecture--tenant-isolation)
2. [Authentication & Base URL](#2-authentication--base-url)
3. [HTTP Headers & Caching Conventions](#3-http-headers--caching-conventions)
4. [Response Formats & Standard Errors](#4-response-formats--standard-errors)
5. [TypeScript Type Definitions](#5-typescript-type-definitions)
6. [Complete Endpoints Reference](#6-complete-endpoints-reference)
   - [1. Site Identity & Branding (`GET /site-config`)](#1-site-identity--branding-get-site-config)
   - [2. List Published Articles (`GET /posts`)](#2-list-published-articles-get-posts)
   - [3. Get Single Article Details (`GET /posts/:slug`)](#3-get-single-article-details-get-postsslug)
   - [4. List Categories (`GET /categories`)](#4-list-categories-get-categories)
   - [5. Category Articles Feed (`GET /category/:slug`)](#5-category-articles-feed-get-categoryslug)
   - [6. Grouped Categories Feed (`GET /categories/posts`)](#6-grouped-categories-feed-get-categoriesposts)
   - [7. List Authors (`GET /authors`)](#7-list-authors-get-authors)
   - [8. List Series Collections (`GET /series`)](#8-list-series-collections-get-series)
   - [9. Single Series Details (`GET /series/:slug`)](#9-single-series-details-get-seriesslug)
   - [10. List Custom Pages (`GET /pages`)](#10-list-custom-pages-get-pages)
   - [11. Single Page Details (`GET /pages/:slug`)](#11-single-page-details-get-pagesslug)
   - [12. Master Sitemap Index (`GET /sitemap`)](#12-master-sitemap-index-get-sitemap)
   - [13. Chunked Sitemap Posts (`GET /sitemap/posts`)](#13-chunked-sitemap-posts-get-sitemapposts)
   - [14. Newsletter Opt-in (`POST /subscribe`)](#14-newsletter-opt-in-post-subscribe)
   - [15. API Methods Directory (`GET /methods`)](#15-api-methods-directory-get-methods)
   - [16. Ad Placements & Script Injections (`GET /ads`)](#16-ad-placements--script-injections-get-ads)
7. [Frontend Integration Patterns (Next.js / Astro)](#7-frontend-integration-patterns-nextjs--astro)
8. [LLM System Integration Prompt Example](#8-llm-system-integration-prompt-example)

---

## 1. Architecture & Tenant Isolation

WriterSuite provides an API-first, multi-tenant headless engine. Each domain/subdomain on the platform operates as an isolated tenant:
- **Database Partitioning**: Content queries are strictly scoped to the tenant domain context derived from the API Key or request host header.
- **CDN & Edge Caching**: Responses are automatically cached using Redis + Memory LRU cache to deliver ultra-low latency response times (<15ms).
- **SEO Pre-compilation**: Single article endpoints automatically output pre-compiled, schema-compliant JSON-LD structured data (`BlogPosting`) and OpenGraph/Meta tags.

---

## 2. Authentication & Base URL

### Base URL Patterns
- **Subdomain Domain**: `https://{subdomain}.writersuite.app/api/v1`
- **Custom Production Domain**: `https://{custom-domain.com}/api/v1`

### Authentication Credentials
Every request must present an active API key (`ws_live_...`) generated in your WriterSuite Publication Developer Console.

1. **HTTP Header (Preferred)**:
   ```http
   x-api-key: ws_live_a1b2c3d4e5f67890123456789012345678901234567890123456789012345678
   ```

2. **Query Parameter Fallback**:
   ```http
   GET https://{subdomain}.writersuite.app/api/v1/posts?api_key=ws_live_a1b2c3d4...
   ```

---

## 3. HTTP Headers & Caching Conventions

| Header | Type | Description |
| :--- | :--- | :--- |
| `x-api-key` | `string` | **Required.** Your tenant domain API key. |
| `Content-Type` | `string` | **Required for POST.** `application/json` |
| `Accept` | `string` | `application/json` |

---

## 4. Response Formats & Standard Errors

Standard HTTP status codes are returned:

| Code | Status | Description |
| :--- | :--- | :--- |
| `200` | `OK` | Request succeeded. Body contains JSON payload. |
| `400` | `Bad Request` | Missing mandatory parameter or malformed JSON. |
| `401` | `Unauthorized` | Invalid or missing `x-api-key`. |
| `404` | `Not Found` | Requested resource (post, page, category, series) does not exist. |
| `500` | `Internal Server Error` | Backend execution exception. |

### Standard Error Payload
```json
{
  "error": "Invalid API key provided or key has been revoked."
}
```

---

## 5. TypeScript Type Definitions

For TypeScript projects (Next.js, Remix, Astro, Nuxt), use these core type interfaces:

```typescript
export interface SiteConfig {
  id: string;
  domain_name: string;
  subdomain_prefix: string;
  site_title: string;
  site_tagline: string;
  site_description: string;
  logo_url: string;
  public_production_url: string;
}

export interface Author {
  name: string;
  avatar_url?: string;
  tagline?: string;
  bio?: string;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
}

export interface PostListItem {
  id: string;
  title: string;
  subheading: string;
  slug: string;
  meta_description: string;
  thumbnail_url: string;
  publish_date: string;
  category: Category;
  author: Author;
}

export interface PostDetail extends PostListItem {
  content: string;
  schema_markup: Record<string, any>;
  meta_tag: {
    title: string;
    description: string;
    canonical: string;
  };
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description: string;
  posts?: Array<{
    part_number: number;
    title: string;
    slug: string;
  }>;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  meta_description: string;
  created_at?: string;
}

export interface AdPlacements {
  header: string;     // Global <head> script injection (Google Analytics GA4, GTM, Meta Pixel, AdSense)
  sidebar: string;    // Sidebar banner ad unit HTML/script
  footer: string;     // Footer banner ad unit HTML/script
  in_article: string; // In-article body placement HTML/script
}
```

---

## 6. Complete Endpoints Reference

---

### 1. Site Identity & Branding (`GET /site-config`)

Retrieves domain site metadata, title, tagline, logo URL, and public production domain.

- **HTTP Method**: `GET`
- **Path**: `/api/v1/site-config`

#### Request Examples
```bash
# cURL
curl -X GET "https://techjournal.writersuite.app/api/v1/site-config" \
  -H "x-api-key: ws_live_YOUR_API_KEY"
```

#### Success Response (`200 OK`)
```json
{
  "id": "dom_7f8a9b0c1d2e",
  "domain_name": "techjournal.writersuite.app",
  "subdomain_prefix": "techjournal",
  "site_title": "TechJournal Daily",
  "site_tagline": "Architecting the Future of Software Systems",
  "site_description": "Editorial publication focusing on AI systems, Cloud Native infrastructure, and Software Architecture.",
  "logo_url": "https://cdn.writersuite.app/uploads/techjournal-logo.png",
  "public_production_url": "https://techjournal.io"
}
```

---

### 2. List Published Articles (`GET /posts`)

Retrieves a paginated list of published articles sorted by publication date (`publish_date DESC`).

- **HTTP Method**: `GET`
- **Path**: `/api/v1/posts`
- **Query Parameters**:
  - `page` (`integer`, optional, default: `1`): Current page index.
  - `limit` (`integer`, optional, default: `10`, max: `100`): Items per page.

#### Request Examples
```javascript
// JavaScript Fetch
const res = await fetch('https://techjournal.writersuite.app/api/v1/posts?page=1&limit=10', {
  headers: { 'x-api-key': 'ws_live_YOUR_API_KEY' }
});
const data = await res.json();
```

#### Success Response (`200 OK`)
```json
{
  "items": [
    {
      "id": "post_a1b2c3d4",
      "title": "Building Distributed Systems with Event-Driven Architectures",
      "subheading": "How message brokers and event loops power resilient cloud services.",
      "slug": "distributed-systems-event-driven-architecture",
      "meta_description": "Explore event-driven architectures, Kafka pipelines, and saga transaction patterns.",
      "thumbnail_url": "https://cdn.writersuite.app/uploads/event-driven-banner.webp",
      "publish_date": "2026-08-06T10:00:00.000Z",
      "category": {
        "name": "Architecture",
        "slug": "architecture"
      },
      "author": {
        "name": "Alex Rivera",
        "avatar_url": "https://cdn.writersuite.app/avatars/alex-rivera.webp",
        "tagline": "Principal Systems Engineer",
        "bio": "Specializing in distributed databases and high-concurrency systems."
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "limit": 10,
    "totalPages": 5,
    "totalItems": 48
  }
}
```

---

### 3. Get Single Article Details (`GET /posts/:slug`)

Retrieves complete article details including full HTML content, pre-compiled SEO metadata tags, and JSON-LD schema.

- **HTTP Method**: `GET`
- **Path**: `/api/v1/posts/:slug`
- **Path Parameters**:
  - `:slug` (`string`, required): Article URL slug.

#### Success Response (`200 OK`)
```json
{
  "id": "post_a1b2c3d4",
  "title": "Building Distributed Systems with Event-Driven Architectures",
  "subheading": "How message brokers and event loops power resilient cloud services.",
  "slug": "distributed-systems-event-driven-architecture",
  "content": "<h2>Introduction</h2><p>Event-driven architecture (EDA) decouples producers and consumers...</p>",
  "meta_description": "Explore event-driven architectures, Kafka pipelines, and saga transaction patterns.",
  "thumbnail_url": "https://cdn.writersuite.app/uploads/event-driven-banner.webp",
  "publish_date": "2026-08-06T10:00:00.000Z",
  "schema_markup": {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Building Distributed Systems with Event-Driven Architectures",
    "datePublished": "2026-08-06T10:00:00.000Z",
    "author": {
      "@type": "Person",
      "name": "Alex Rivera"
    }
  },
  "meta_tag": {
    "title": "Building Distributed Systems with Event-Driven Architectures",
    "description": "Explore event-driven architectures, Kafka pipelines, and saga transaction patterns.",
    "canonical": "https://techjournal.io/distributed-systems-event-driven-architecture"
  },
  "category": {
    "name": "Architecture",
    "slug": "architecture"
  },
  "author": {
    "name": "Alex Rivera",
    "avatar_url": "https://cdn.writersuite.app/avatars/alex-rivera.webp",
    "tagline": "Principal Systems Engineer",
    "bio": "Specializing in distributed databases and high-concurrency systems."
  }
}
```

---

### 4. List Categories (`GET /categories`)

Retrieves all active categories configured for the domain.

- **HTTP Method**: `GET`
- **Path**: `/api/v1/categories`

#### Success Response (`200 OK`)
```json
[
  {
    "id": "cat_101",
    "category_name": "Architecture",
    "slug": "architecture"
  },
  {
    "id": "cat_102",
    "category_name": "Artificial Intelligence",
    "slug": "artificial-intelligence"
  }
]
```

---

### 5. Category Articles Feed (`GET /category/:slug`)

Retrieves a paginated list of articles belonging to a specific category slug.

- **HTTP Method**: `GET`
- **Path**: `/api/v1/category/:slug`
- **Query Parameters**:
  - `page` (`integer`, optional, default: `1`)
  - `limit` (`integer`, optional, default: `10`)

#### Success Response (`200 OK`)
```json
{
  "category": {
    "id": "cat_101",
    "name": "Architecture",
    "slug": "architecture"
  },
  "items": [
    {
      "id": "post_a1b2c3d4",
      "title": "Building Distributed Systems with Event-Driven Architectures",
      "slug": "distributed-systems-event-driven-architecture",
      "meta_description": "Explore event-driven architectures, Kafka pipelines, and saga transaction patterns.",
      "thumbnail_url": "https://cdn.writersuite.app/uploads/event-driven-banner.webp",
      "publish_date": "2026-08-06T10:00:00.000Z",
      "author": {
        "name": "Alex Rivera"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "limit": 10,
    "totalPages": 2,
    "totalItems": 14
  }
}
```

---

### 6. Grouped Categories Feed (`GET /categories/posts`)

Returns articles grouped under EVERY active category up to a specified limit per category (ideal for portal homepages).

- **HTTP Method**: `GET`
- **Path**: `/api/v1/categories/posts`
- **Query Parameters**:
  - `limit` (`integer`, optional, default: `5`, max: `20`)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "limit_per_category": 5,
  "categories": [
    {
      "id": "cat_101",
      "category_name": "Architecture",
      "slug": "architecture",
      "posts": [
        {
          "id": "post_a1b2c3d4",
          "title": "Building Distributed Systems with Event-Driven Architectures",
          "slug": "distributed-systems-event-driven-architecture"
        }
      ]
    }
  ]
}
```

---

### 7. List Authors (`GET /authors`)

Retrieves all author profiles configured under this tenant domain.

- **HTTP Method**: `GET`
- **Path**: `/api/v1/authors`

#### Success Response (`200 OK`)
```json
[
  {
    "id": "author_001",
    "name": "Alex Rivera",
    "username": "arivera",
    "avatar_url": "https://cdn.writersuite.app/avatars/alex-rivera.webp",
    "tagline": "Principal Systems Engineer",
    "bio": "Specializing in distributed databases and high-concurrency systems."
  }
]
```

---

### 8. List Series Collections (`GET /series`)

Retrieves all curated multi-part content series collections.

- **HTTP Method**: `GET`
- **Path**: `/api/v1/series`

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "items": [
    {
      "id": "series_301",
      "title": "Mastering Microservices Architecture",
      "slug": "mastering-microservices-architecture",
      "description": "A comprehensive 4-part series covering service discovery, gRPC, and saga orchestration."
    }
  ]
}
```

---

### 9. Single Series Details (`GET /series/:slug`)

Retrieves metadata and ordered parts for a specific content series.

- **HTTP Method**: `GET`
- **Path**: `/api/v1/series/:slug`

#### Success Response (`200 OK`)
```json
{
  "id": "series_301",
  "title": "Mastering Microservices Architecture",
  "slug": "mastering-microservices-architecture",
  "description": "A comprehensive 4-part series covering service discovery, gRPC, and saga orchestration.",
  "posts": [
    {
      "part_number": 1,
      "title": "Part 1: Service Discovery and Mesh Routing",
      "slug": "part-1-service-discovery-and-mesh-routing"
    },
    {
      "part_number": 2,
      "title": "Part 2: Distributed Tracing with OpenTelemetry",
      "slug": "part-2-distributed-tracing-opentelemetry"
    }
  ]
}
```

---

### 10. List Custom Pages (`GET /pages`)

Retrieves static custom pages (e.g., About Us, Privacy Policy, Terms).

- **HTTP Method**: `GET`
- **Path**: `/api/v1/pages`

#### Success Response (`200 OK`)
```json
[
  {
    "id": "page_901",
    "title": "About Us",
    "slug": "about-us",
    "meta_description": "Learn about our editorial staff and mission.",
    "created_at": "2026-07-01T10:00:00.000Z"
  }
]
```

---

### 11. Single Page Details (`GET /pages/:slug`)

Retrieves full rich-text content for a single static page.

- **HTTP Method**: `GET`
- **Path**: `/api/v1/pages/:slug`

#### Success Response (`200 OK`)
```json
{
  "id": "page_901",
  "title": "About Us",
  "slug": "about-us",
  "content": "<h1>About Our Publication</h1><p>We deliver authoritative tech journalism...</p>",
  "meta_description": "Learn about our editorial staff and mission."
}
```

---

### 12. Master Sitemap Index (`GET /sitemap`)

Returns sitemap metadata, pages, categories, and total post partition count for building dynamic XML sitemaps.

- **HTTP Method**: `GET`
- **Path**: `/api/v1/sitemap`

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "base_url": "https://techjournal.io",
  "total_posts": 1450,
  "total_post_pages": 2,
  "pages": [
    {
      "title": "About Us",
      "url": "https://techjournal.io/about-us",
      "slug": "about-us",
      "lastmod": "2026-08-01T12:00:00.000Z"
    }
  ],
  "categories": [
    {
      "name": "Architecture",
      "url": "https://techjournal.io/category/architecture",
      "slug": "architecture"
    }
  ]
}
```

---

### 13. Chunked Sitemap Posts (`GET /sitemap/posts`)

Retrieves up to 1,000 articles per page chunk formatted for generating XML post sub-sitemaps.

- **HTTP Method**: `GET`
- **Path**: `/api/v1/sitemap/posts`
- **Query Parameters**:
  - `page` (`integer`, optional, default: `1`)
  - `limit` (`integer`, optional, default: `1000`, max: `1000`)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "base_url": "https://techjournal.io",
  "page": 1,
  "limit": 1000,
  "total_items": 1450,
  "total_pages": 2,
  "items": [
    {
      "title": "Building Distributed Systems with Event-Driven Architectures",
      "slug": "distributed-systems-event-driven-architecture",
      "url": "https://techjournal.io/distributed-systems-event-driven-architecture",
      "thumbnail_url": "https://cdn.writersuite.app/uploads/event-driven-banner.webp",
      "lastmod": "2026-08-06T10:00:00.000Z"
    }
  ]
}
```

---

### 14. Newsletter Opt-in (`POST /subscribe`)

Registers a reader's email address to your publication newsletter subscriber list.

- **HTTP Method**: `POST`
- **Path**: `/api/v1/subscribe`
- **Body (`application/json`)**:
```json
{
  "email": "reader@example.com"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Subscribed successfully!"
}
```

---

### 15. API Methods Directory (`GET /methods`)

Returns a self-documenting JSON directory of all available REST endpoints.

- **HTTP Method**: `GET`
- **Path**: `/api/v1/methods`

---

### 16. Ad Placements & Script Injections (`GET /ads`)

Retrieves all configured ad placement HTML blocks and global tracking script injections (`header`, `sidebar`, `footer`, `in_article`).

- **HTTP Method**: `GET`
- **Path**: `/api/v1/ads`

#### Request Examples
```bash
# cURL
curl -X GET "https://techjournal.writersuite.app/api/v1/ads" \
  -H "x-api-key: ws_live_YOUR_API_KEY"
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "placements": {
    "header": "<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-XXXXXX\"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXX');</script>",
    "sidebar": "<ins class=\"adsbygoogle\" style=\"display:block\" data-ad-client=\"ca-pub-123456789\" data-ad-slot=\"987654321\" data-ad-format=\"auto\"></ins>",
    "footer": "<div class=\"footer-ad-banner\"><!-- Custom Banner --></div>",
    "in_article": "<ins class=\"adsbygoogle\" style=\"display:block; text-align:center;\" data-ad-layout=\"in-article\"></ins>"
  }
}
```

> [!IMPORTANT]
> **Global Header Script Injection**: The `header` placement is specifically intended to contain site-wide analytics tracking codes (Google Analytics 4, Google Tag Manager, Meta Pixel, Hotjar) and global ad verification scripts. Headless frontends **MUST** render `header` directly inside the document `<head>` (or root layout) to ensure analytics and ad tracking function correctly.

---

## 7. Frontend Integration Patterns (Next.js / Astro)

### Next.js App Router Data & Global Header Injection Example
```typescript
// app/layout.tsx (Next.js Root Layout)
import { AdPlacements } from '@/types/writersuite';

const API_BASE = process.env.NEXT_PUBLIC_WRITERSUITE_API_URL!;
const API_KEY = process.env.WRITERSUITE_API_KEY!;

async function getAdPlacements(): Promise<AdPlacements | null> {
  try {
    const res = await fetch(`${API_BASE}/ads`, {
      headers: { 'x-api-key': API_KEY },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.placements;
  } catch (err) {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const ads = await getAdPlacements();

  return (
    <html lang="en">
      <head>
        {/* CRITICAL: Inject global analytics (GA4, GTM, Meta Pixel) & header ad scripts into <head> */}
        {ads?.header && (
          <div dangerouslySetInnerHTML={{ __html: ads.header }} />
        )}
      </head>
      <body>
        {children}
        {ads?.footer && (
          <div className="footer-ad-container" dangerouslySetInnerHTML={{ __html: ads.footer }} />
        )}
      </body>
    </html>
  );
}
```

### Next.js Article Page Component with Sidebar & In-Article Ads
```typescript
// app/posts/[slug]/page.tsx
import { getAdPlacements } from '@/lib/writersuite';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const ads = await getAdPlacements();
  
  return (
    <main class="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <article class="lg:col-span-8">
        {/* Render In-Article Ad Banner */}
        {ads?.in_article && (
          <div className="my-6 ad-in-article" dangerouslySetInnerHTML={{ __html: ads.in_article }} />
        )}
      </article>

      <aside class="lg:col-span-4">
        {/* Render Sidebar Ad Unit */}
        {ads?.sidebar && (
          <div className="sticky top-4 ad-sidebar" dangerouslySetInnerHTML={{ __html: ads.sidebar }} />
        )}
      </aside>
    </main>
  );
}
```

---

## 8. LLM System Integration Prompt Example

Use this prompt template when integrating WriterSuite Headless Content API into AI agents or automated code generators:

```text
You are an expert full-stack web developer integrating the WriterSuite Headless Content API (v1).

API BASE URL: https://{YOUR_SUBDOMAIN}.writersuite.app/api/v1
API KEY: ws_live_YOUR_API_KEY

CORE INSTRUCTIONS:
1. Always pass the API key in the 'x-api-key' HTTP header.
2. For articles list, call 'GET /posts?page=1&limit=10'.
3. For individual article content & pre-compiled SEO metadata, call 'GET /posts/:slug'.
4. For grouped homepage sections, call 'GET /categories/posts?limit=5'.
5. For custom static pages (About, Terms), call 'GET /pages/:slug'.
6. For newsletter subscriptions, send POST to '/subscribe' with JSON body { "email": "user@example.com" }.
7. For ad placements and tracking script injections, call 'GET /ads'.
8. CRITICAL - GLOBAL HEADER INJECTION: The 'placements.header' field returned by 'GET /ads' contains site-wide analytics tracking codes (Google Analytics GA4, Google Tag Manager, Meta Pixel) and ad verification scripts. Always inject 'placements.header' directly into the document <head> or root layout HTML of the headless frontend using dangerouslySetInnerHTML (Next.js/React) or set:html (Astro).
9. Render 'placements.sidebar', 'placements.footer', and 'placements.in_article' in their respective layout containers when non-empty.
10. Handle HTTP 404 when an article or page slug does not exist.
```
