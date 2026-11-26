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

export function resolveBlogHeroImage(heroImage?: string): ImageMetadata | undefined {
  if (!heroImage) return undefined;
  const normalized = heroImage.trim().replace(/^\/+/, '');
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
