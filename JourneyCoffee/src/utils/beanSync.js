/**
 * Bean catalog sync utility.
 *
 * Strategy for keeping the in-app bean catalog current with the
 * Journey Coffee Roasters website:
 *
 * APPROACH: Hybrid manual + automated sync
 *
 * 1. PRIMARY: The app ships with a seed catalog (src/data/beans.js).
 *    This is the offline fallback and always available.
 *
 * 2. REMOTE SYNC: On app launch (or manual refresh), the app fetches
 *    a JSON endpoint that lists the current bean catalog. This endpoint
 *    can be hosted on the Journey Coffee Roasters website or a simple
 *    CDN/API service.
 *
 *    Expected endpoint format:
 *    GET https://www.journeycoffeeroasters.com/api/beans.json
 *    (or a similar URL serving structured JSON)
 *
 * 3. SCRAPING FALLBACK: If no dedicated API is available, a server-side
 *    scraper can periodically pull product data from the website's
 *    collections page and output a JSON file. The app then fetches
 *    this pre-scraped JSON.
 *
 * 4. ADMIN REFRESH: A manual "Check for new beans" button in the app
 *    triggers the sync. This keeps the experience user-controlled
 *    and avoids unnecessary network calls.
 *
 * The bean catalog is stored locally via AsyncStorage so that previously
 * synced data persists offline.
 */

import { SEED_BEANS } from '../data/beans';
import { saveBeanCatalog, loadBeanCatalog } from './storage';

const BEAN_CATALOG_URL =
  'https://www.journeycoffeeroasters.com/api/beans.json';

/**
 * Attempt to sync the bean catalog from the remote source.
 * Falls back to seed data if the fetch fails.
 *
 * @returns {{ beans: Array, source: 'remote' | 'cached' | 'seed', error?: string }}
 */
export async function syncBeanCatalog() {
  try {
    const response = await fetch(BEAN_CATALOG_URL, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const remoteData = await response.json();

    // Validate structure
    if (!Array.isArray(remoteData) || remoteData.length === 0) {
      throw new Error('Invalid bean catalog format');
    }

    // Map to internal structure (normalize fields)
    const beans = remoteData.map((item) => ({
      id: item.id || `bean-${item.title?.toLowerCase().replace(/\s+/g, '-')}`,
      title: item.title || 'Unknown',
      url: item.url || item.product_url || '',
      description: item.description || '',
      roastLevel: item.roastLevel || item.roast_level || 'medium',
      flavorTags: item.flavorTags || item.flavor_tags || [],
      recommendedMethods: item.recommendedMethods || item.recommended_methods || ['pourover'],
      recommendedRecipeIds: item.recommendedRecipeIds || [],
      imageUrl: item.imageUrl || item.image_url || null,
      priceUsd: item.priceUsd || item.price || null,
    }));

    await saveBeanCatalog(beans);
    return { beans, source: 'remote' };
  } catch (error) {
    // Try cached version
    const cached = await loadBeanCatalog();
    if (cached && cached.length > 0) {
      return { beans: cached, source: 'cached', error: error.message };
    }

    // Fall back to seed data
    return { beans: SEED_BEANS, source: 'seed', error: error.message };
  }
}

/**
 * Parse a basic HTML product listing page to extract bean data.
 *
 * This is a simplified scraper that works with common Shopify-style
 * product listing pages. In production, this would run server-side
 * and output JSON for the app to consume.
 *
 * @param {string} html - Raw HTML from the collections page
 * @returns {Array} Parsed bean entries
 */
export function parseProductListingHTML(html) {
  const beans = [];
  // Match product grid items (Shopify pattern)
  const productPattern =
    /<a[^>]*href="(\/products\/[^"]+)"[^>]*>[\s\S]*?<[^>]*class="[^"]*product-title[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/gi;

  let match;
  while ((match = productPattern.exec(html)) !== null) {
    const url = `https://www.journeycoffeeroasters.com${match[1]}`;
    const title = match[2].replace(/<[^>]+>/g, '').trim();

    if (title) {
      beans.push({
        id: `bean-${title.toLowerCase().replace(/\s+/g, '-')}`,
        title,
        url,
        description: '',
        roastLevel: 'medium',
        flavorTags: [],
        recommendedMethods: ['pourover'],
        recommendedRecipeIds: [],
        imageUrl: null,
        priceUsd: null,
      });
    }
  }

  return beans;
}
