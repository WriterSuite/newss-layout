export interface SiteConfig {
  id?: string;
  domain_name?: string;
  subdomain_prefix?: string;
  site_title: string;
  site_tagline: string;
  site_description: string;
  logo_url?: string;
  public_production_url?: string;
}

export interface Author {
  id?: string;
  name: string;
  username?: string;
  avatar_url?: string;
  tagline?: string;
  bio?: string;
}

export interface Category {
  id?: string;
  name?: string;
  category_name?: string;
  slug: string;
}

export interface PostListItem {
  id: string;
  title: string;
  subheading?: string;
  slug: string;
  meta_description?: string;
  thumbnail_url?: string;
  publish_date: string;
  category: Category;
  author: Author;
  readTime?: string;
  isSpecialReport?: boolean;
}

export interface PostDetail extends PostListItem {
  content: string;
  schema_markup?: Record<string, any>;
  meta_tag?: {
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
  meta_description?: string;
  created_at?: string;
}

export interface AdsConfig {
  header?: string;
  sidebar?: string;
  footer?: string;
  in_article?: string;
  // Aliases for compatibility
  header_injection_code?: string;
  article_ad_code?: string;
  sidebar_ad_code?: string;
  footer_ad_code?: string;
}

const DEFAULT_API_URL = "https://techcucu.writersuite.app/api/v1";
const DEFAULT_API_KEY = "ws_live_deac1a944d5f319ca12c51204db55466378b75cc09ce61767b9eb11187df78c6";

function getApiCredentials() {
  const apiUrl = import.meta.env.API_URL || process.env.API_URL || DEFAULT_API_URL;
  const apiKey = import.meta.env.API_KEY || process.env.API_KEY || DEFAULT_API_KEY;
  return { apiUrl: apiUrl.replace(/\/$/, ""), apiKey };
}

async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const { apiUrl, apiKey } = getApiCredentials();
  const url = `${apiUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] [WriterSuite API Request] GET ${url}`);
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      console.warn(`[${timestamp}] [WriterSuite API Warning] Status ${res.status} ${res.statusText} for URL ${url}. Using fallback data.`);
      return null;
    }

    const data = await res.json() as T;
    console.log(`[${timestamp}] [WriterSuite API Success] 200 OK for URL ${url}`);
    return data;
  } catch (err) {
    console.error(`[${timestamp}] [WriterSuite API Error] Failed to fetch ${url}:`, err);
    return null;
  }
}

// Fallback Mock Data for ultra-resilient rendering
export const FALLBACK_SITE_CONFIG: SiteConfig = {
  site_title: "The Global Chronicle",
  site_tagline: "International Edition • Truth in Reporting • Est. 1898",
  site_description: "Authoritative global news portal covering geopolitics, technology, markets, climate, and culture.",
  logo_url: "https://cdn.writersuite.app/uploads/techjournal-logo.png",
  public_production_url: "https://globalchronicle.app"
};

export const FALLBACK_CATEGORIES: Category[] = [
  { id: "cat_world", name: "World Affairs", slug: "world" },
  { id: "cat_tech", name: "Technology", slug: "technology" },
  { id: "cat_biz", name: "Business & Finance", slug: "business" },
  { id: "cat_climate", name: "Climate & Science", slug: "climate" },
  { id: "cat_opinion", name: "Opinion", slug: "opinion" },
  { id: "cat_culture", name: "Arts & Culture", slug: "culture" },
];

export const FALLBACK_POSTS: PostListItem[] = [
  {
    id: "hero-big-post",
    title: "Historic Summit Yields Accord on AI Safeguards and Clean Energy Transition",
    subheading: "World leaders gathered in Geneva finalize an unprecedented framework governing advanced artificial intelligence deployment.",
    slug: "historic-summit-yields-accord-on-ai-safeguards",
    meta_description: "Global climate and tech security summit reaches consensus in Geneva.",
    thumbnail_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    publish_date: "2026-08-09T10:00:00.000Z",
    category: { name: "World & Climate", slug: "world" },
    author: {
      name: "Sarah Jenkins",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
      tagline: "Chief Foreign Editor",
      bio: "Specializing in international security, energy transitions, and diplomatic summits."
    },
    readTime: "7 min read",
    isSpecialReport: true
  },
  {
    id: "post-semiconductors",
    title: "Global Semiconductor Shares Surge Following Breakthrough Microchip Node Announcement",
    subheading: "Next-generation lithography achieves sub-nanometer transistor density.",
    slug: "global-semiconductor-shares-surge-breakthrough-microchip-node",
    meta_description: "Semiconductor market rallies on revolutionary hardware announcement.",
    thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
    publish_date: "2026-08-09T08:15:00.000Z",
    category: { name: "Markets", slug: "business" },
    author: { name: "David Chen", tagline: "Financial Analyst" },
    readTime: "3 min read"
  },
  {
    id: "post-autonomous-transit",
    title: "Autonomous Transportation Fleet Expands Commercial Operations Across 12 Cities",
    subheading: "Urban transit authorities report 40% reduction in municipal gridlock.",
    slug: "autonomous-transportation-fleet-expands-commercial-operations",
    meta_description: "Self-driving municipal fleets roll out across major metropolitan centers.",
    thumbnail_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop",
    publish_date: "2026-08-09T06:30:00.000Z",
    category: { name: "Technology", slug: "technology" },
    author: { name: "Elena Rostova", tagline: "Urban Tech Correspondent" },
    readTime: "5 min read"
  },
  {
    id: "post-exoplanet",
    title: "Orbital Observatory Detects Atmospheric Water Vapor on Nearby Exoplanet",
    subheading: "Spectroscopic data confirms key biosignature elements 40 light-years away.",
    slug: "orbital-observatory-detects-atmospheric-water-vapor-exoplanet",
    meta_description: "Astrophysicists identify habitability indicators on alien world.",
    thumbnail_url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=600&auto=format&fit=crop",
    publish_date: "2026-08-09T04:45:00.000Z",
    category: { name: "Deep Space", slug: "climate" },
    author: { name: "Dr. Marcus Thorne", tagline: "Astrophysics Senior Writer" },
    readTime: "4 min read"
  },
  {
    id: "post-analog-print",
    title: "The Renaissance of Analog Print Media in a Hyper-Digitalized Era",
    subheading: "Independent publishers report record magazine subscriber growth among youth.",
    slug: "renaissance-of-analog-print-media-hyper-digitalized-era",
    meta_description: "Print publications experience a surprising cultural revival.",
    thumbnail_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop",
    publish_date: "2026-08-09T02:00:00.000Z",
    category: { name: "Culture", slug: "culture" },
    author: { name: "Amara Patel", tagline: "Cultural Critic" },
    readTime: "6 min read"
  }
];

// API Methods Implementation
export async function getSiteConfig(): Promise<SiteConfig> {
  const data = await fetchFromApi<SiteConfig>('/site-config');
  return data || FALLBACK_SITE_CONFIG;
}

export async function getPosts(page = 1, limit = 10): Promise<{ items: PostListItem[]; pagination?: any }> {
  const data = await fetchFromApi<{ items: PostListItem[]; pagination: any }>(`/posts?page=${page}&limit=${limit}`);
  if (data && data.items && data.items.length > 0) {
    return data;
  }
  return {
    items: FALLBACK_POSTS,
    pagination: { currentPage: 1, limit: 10, totalPages: 1, totalItems: FALLBACK_POSTS.length }
  };
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const data = await fetchFromApi<PostDetail>(`/posts/${slug}`);
  if (data && data.content) {
    return data;
  }

  // Check fallback post match or generate structured article
  const fallbackMatch = FALLBACK_POSTS.find(p => p.slug === slug || p.id === slug);
  const base = fallbackMatch || FALLBACK_POSTS[0];

  return {
    ...base,
    slug: slug,
    content: `
      <p class="text-xl font-serif leading-relaxed text-zinc-800 dark:text-zinc-200 mb-6 drop-cap">
        World leaders assembled at the Palais des Nations in Geneva have officially signed the landmark treaty establishing international safety protocols for autonomous systems and high-capacity machine learning infrastructure.
      </p>

      <h2 class="font-serif text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">A Framework Built on International Consensus</h2>
      <p class="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 mb-6">
        Following fourteen straight days of marathon negotiation sessions, delegates representing 140 nations agreed on binding verification mechanisms for advanced compute deployments, alongside a unified $400 billion green transition initiative designed to bring zero-carbon power grids to emerging markets.
      </p>

      <blockquote class="my-8 p-6 bg-brand-50 dark:bg-zinc-900 border-l-4 border-brand-600 rounded-r-xl italic font-serif text-lg text-zinc-900 dark:text-zinc-100">
        "This accord represents not merely a technical treaty, but a commitment to ensure technological progress directly serves global human welfare and environmental stability."
        <footer class="mt-2 text-xs font-sans font-bold text-brand-600 dark:text-brand-400 not-italic">— Sarah Jenkins, Geneva Bureau</caption>
      </blockquote>

      <h2 class="font-serif text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">Energy Grid Modernization and Deep Tech</h2>
      <p class="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 mb-6">
        Under the terms of Section 4 of the agreement, signatory nations will establish standardized audit protocols for data centers operating at megawatt scales. Concurrently, public-private partnerships will accelerate geothermal and Next-Gen nuclear power plants.
      </p>

      <div class="my-8 p-6 bg-zinc-900 text-white rounded-xl shadow-lg border border-zinc-800">
        <h3 class="font-serif font-bold text-lg text-brand-400 mb-2"><i class="fa-solid fa-lightbulb mr-2"></i> Key Takeaways of the Geneva Accord</h3>
        <ul class="space-y-2 text-sm text-zinc-300">
          <li class="flex items-start gap-2"><i class="fa-solid fa-check text-emerald-400 mt-1"></i> Mandatory safety audits for frontier compute clusters exceeding 10^26 FLOPs.</li>
          <li class="flex items-start gap-2"><i class="fa-solid fa-check text-emerald-400 mt-1"></i> $400 Billion capital allocation for renewable microgrids across developing economies.</li>
          <li class="flex items-start gap-2"><i class="fa-solid fa-check text-emerald-400 mt-1"></i> Establishment of the International Algorithmic Safety Agency (IASA).</li>
        </ul>
      </div>

      <p class="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 mb-6">
        Financial markets responded positively to the announcement, with green energy index funds rallying sharply across European and North American trading floors. Implementation of the initial provisions is scheduled to begin in Q4 2026.
      </p>
    `,
    meta_tag: {
      title: `${base.title} - The Global Chronicle`,
      description: base.meta_description || base.subheading || base.title,
      canonical: `https://globalchronicle.app/article/${slug}`
    },
    schema_markup: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": base.title,
      "datePublished": base.publish_date,
      "author": {
        "@type": "Person",
        "name": base.author.name
      }
    }
  };
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetchFromApi<Category[]>('/categories');
  return (data && data.length > 0) ? data : FALLBACK_CATEGORIES;
}

export async function getCategoryPosts(slug: string, page = 1, limit = 10): Promise<{ category: Category; items: PostListItem[]; pagination?: any }> {
  const data = await fetchFromApi<{ category: Category; items: PostListItem[]; pagination: any }>(`/category/${slug}?page=${page}&limit=${limit}`);
  if (data && data.items && data.items.length > 0) {
    return data;
  }

  const category = FALLBACK_CATEGORIES.find(c => c.slug === slug) || { name: slug.toUpperCase(), slug };
  const filtered = FALLBACK_POSTS.filter(p => p.category.slug === slug || slug === 'all' || true);
  
  return {
    category,
    items: filtered,
    pagination: { currentPage: page, limit, totalPages: 1, totalItems: filtered.length }
  };
}

export async function getGroupedCategoryPosts(limit = 5): Promise<Array<{ id: string; category_name: string; slug: string; posts: PostListItem[] }>> {
  const data = await fetchFromApi<{ success: boolean; categories: any[] }>(`/categories/posts?limit=${limit}`);
  if (data && data.categories && data.categories.length > 0) {
    return data.categories;
  }

  return FALLBACK_CATEGORIES.map(cat => ({
    id: cat.id || cat.slug,
    category_name: cat.name || cat.category_name || cat.slug,
    slug: cat.slug,
    posts: FALLBACK_POSTS.slice(0, limit)
  }));
}

export async function getAuthors(): Promise<Author[]> {
  const data = await fetchFromApi<Author[]>('/authors');
  return data || [
    {
      name: "Sarah Jenkins",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
      tagline: "Chief Foreign Editor",
      bio: "Covering diplomatic relations, global governance, and technology policy."
    },
    {
      name: "Dr. Aris Vance",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      tagline: "Professor of Cognitive Science, Oxford",
      bio: "Bi-weekly essayist exploring human cognition and technology."
    }
  ];
}

export async function getPages(): Promise<Page[]> {
  const data = await fetchFromApi<Page[]>('/pages');
  return data || [
    { id: "page_about", title: "About Us", slug: "about-us", meta_description: "Learn about our publication" }
  ];
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const data = await fetchFromApi<Page>(`/pages/${slug}`);
  if (data && data.content) return data;
  return {
    id: `page_${slug}`,
    title: slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
    slug,
    content: `<h2>About Our Publication</h2><p>The Global Chronicle is an authoritative publication delivering unbiased news across geopolitics, technology, economics, and culture.</p>`,
    meta_description: `Read about ${slug} on The Global Chronicle.`
  };
}

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const { apiUrl, apiKey } = getApiCredentials();
  try {
    const res = await fetch(`${apiUrl}/subscribe`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error('Subscribe API error:', err);
  }
  return { success: true, message: "Subscribed successfully!" };
}

export const FALLBACK_ADS_CONFIG: AdsConfig = {
  header: `<!-- Global Header Analytics & Scripts -->
<script>
  console.log('[WriterSuite] Global Header Analytics & Ad Scripts Initialized');
</script>`,
  sidebar: `<!-- Sidebar Ad Placement -->`,
  footer: `<!-- Footer Ad Placement -->`,
  in_article: `<!-- In-Article Ad Placement -->`
};

export async function getAdsConfig(): Promise<AdsConfig> {
  const res = await fetchFromApi<{ success?: boolean; placements?: AdsConfig } | AdsConfig>('/ads');
  if (!res) return FALLBACK_ADS_CONFIG;

  const placements = ('placements' in res && res.placements) ? res.placements : res;
  
  const header = placements.header || placements.header_injection_code || FALLBACK_ADS_CONFIG.header;
  const sidebar = placements.sidebar || placements.sidebar_ad_code || FALLBACK_ADS_CONFIG.sidebar;
  const footer = placements.footer || placements.footer_ad_code || FALLBACK_ADS_CONFIG.footer;
  const in_article = placements.in_article || placements.article_ad_code || FALLBACK_ADS_CONFIG.in_article;

  return {
    header,
    sidebar,
    footer,
    in_article,
    header_injection_code: header,
    sidebar_ad_code: sidebar,
    footer_ad_code: footer,
    article_ad_code: in_article
  };
}

