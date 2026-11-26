export const SITE_URL = 'https://s2advogados.com.br';
export const DEFAULT_OG_IMAGE = 'https://www.s2advogados.com.br/escritorio-santana.jpg';

export const WHATSAPP_NUMBER = '5534991692737';

export const SITE_INFO = {
  brandName: 'S2 Advogados — Santana Consultoria de Trânsito',
  attorneyName: 'Dra. Marcela Santana',
  oab: 'OAB/MG 220.180',
  phoneDisplay: '(34) 99169-2737',
  address: {
    street: 'R. Manoel Serralha, 569 - Santa Mônica',
    city: 'Uberlândia',
    region: 'MG',
    postalCode: '38408-246',
    country: 'BR',
    formatted: 'R. Manoel Serralha, 569 — Santa Mônica, Uberlândia/MG, 38408-246',
  },
} as const;

export function buildWhatsAppUrl(message: string): string {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
}
