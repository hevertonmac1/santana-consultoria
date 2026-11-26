import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL } from '../data/site';
import { cleanSlug } from '../data/blog';

export const prerender = true;

function formatW3CDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export const GET: APIRoute = async () => {
  const publishedPosts = await getCollection('blog', ({ data }) => !data.draft);

  const staticPages: Array<{ loc: string; lastmod?: string }> = [
    { loc: `${SITE_URL}/` },
    { loc: `${SITE_URL}/blog` },
  ];

  const postPages = publishedPosts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => ({
      loc: `${SITE_URL}/blog/${cleanSlug(post.id)}`,
      lastmod: formatW3CDate(post.data.updatedDate ?? post.data.pubDate),
    }));

  const urls = [...staticPages, ...postPages]
    .map((entry) => {
      const lastmodTag = entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : '';
      return `  <url><loc>${entry.loc}</loc>${lastmodTag}</url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
