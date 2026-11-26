import type { ImageMetadata } from 'astro';

export const CLUSTER_LABELS = {
  multas: 'Multas de Trânsito',
  'suspensao-cassacao': 'Suspensão e Cassação',
  pontos: 'Pontos na CNH',
  blitz: 'Blitz e Lei Seca',
  geral: 'Direito de Trânsito',
} as const;

export type BlogCluster = keyof typeof CLUSTER_LABELS;

export function formatDateBR(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

export function estimateReadingMinutes(markdownBody: string | undefined): number {
  if (!markdownBody) return 1;
  const plain = markdownBody
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`[\]()|!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = plain ? plain.split(' ').length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function cleanSlug(id: string): string {
  return id.replace(/\.(md|mdx)$/i, '');
}

const blogImageModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/img/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

function lookupAsset(pathOrRelative?: string): ImageMetadata | undefined {
  if (!pathOrRelative) return undefined;
  const normalized = pathOrRelative.trim().replace(/^\/+/, '');
  if (!normalized) return undefined;

  const candidates = [
    `/${normalized}`,
    `/src/assets/img/${normalized}`,
    normalized.startsWith('src/') ? `/${normalized}` : '',
  ].filter(Boolean);

  for (const key of candidates) {
    if (blogImageModules[key]?.default) {
      return blogImageModules[key].default;
    }
  }
  return undefined;
}

export function resolveBlogHeroImage(heroImage?: string): ImageMetadata | undefined {
  return lookupAsset(heroImage);
}

export interface ResponsiveCoverAsset {
  avifSrcSet: string;
  webpSrcSet: string;
  src: string;
  width: number;
  height: number;
}

export function resolveBlogResponsiveCover(
  heroImage?: string
): ResponsiveCoverAsset | undefined {
  if (!heroImage) return undefined;
  const base = heroImage
    .trim()
    .replace(/^\/+/, '')
    .replace(/\.(avif|webp|jpe?g|png)$/i, '')
    .replace(/-(800|1200|1600)$/, '');

  const widths = [800, 1200, 1600] as const;
  const avifList = widths
    .map((w) => ({ w, meta: lookupAsset(`${base}-${w}.avif`) }))
    .filter((x): x is { w: (typeof widths)[number]; meta: ImageMetadata } => Boolean(x.meta));
  const webpList = widths
    .map((w) => ({ w, meta: lookupAsset(`${base}-${w}.webp`) }))
    .filter((x): x is { w: (typeof widths)[number]; meta: ImageMetadata } => Boolean(x.meta));

  if (avifList.length === 0 || webpList.length === 0) return undefined;

  const fallback = webpList.find((x) => x.w === 1200)?.meta ?? webpList[webpList.length - 1].meta;

  return {
    avifSrcSet: avifList.map((x) => `${x.meta.src} ${x.w}w`).join(', '),
    webpSrcSet: webpList.map((x) => `${x.meta.src} ${x.w}w`).join(', '),
    src: fallback.src,
    width: fallback.width,
    height: fallback.height,
  };
}

export function resolveBlogOgImage(ogImage?: string): ImageMetadata | undefined {
  return lookupAsset(ogImage);
}
