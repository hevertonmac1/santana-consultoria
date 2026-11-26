import marcelaAvatar240Avif from '../assets/img/autores/marcela-santana-avatar-240.avif';
import marcelaAvatar480Avif from '../assets/img/autores/marcela-santana-avatar-480.avif';
import marcelaAvatar240Webp from '../assets/img/autores/marcela-santana-avatar-240.webp';
import marcelaAvatar480Webp from '../assets/img/autores/marcela-santana-avatar-480.webp';
import marcelaRetrato720Avif from '../assets/img/autores/marcela-santana-retrato-720.avif';
import marcelaRetrato1080Avif from '../assets/img/autores/marcela-santana-retrato-1080.avif';
import marcelaRetrato720Webp from '../assets/img/autores/marcela-santana-retrato-720.webp';
import marcelaRetrato1080Webp from '../assets/img/autores/marcela-santana-retrato-1080.webp';

export const AUTORES = {
  marcela: {
    nome: 'Dra. Marcela Santana',
    nomeSchema: 'Marcela Santana',
    cargo: 'Advogada',
    credencial: 'OAB/MG 220.180',
    url: '/#dra-marcela',
    foto: {
      alt: 'Dra. Marcela Santana, advogada (OAB/MG 220.180)',
      avatar: {
        avifSrcSet: `${marcelaAvatar240Avif.src} 240w, ${marcelaAvatar480Avif.src} 480w`,
        webpSrcSet: `${marcelaAvatar240Webp.src} 240w, ${marcelaAvatar480Webp.src} 480w`,
        src: marcelaAvatar240Webp.src,
        width: marcelaAvatar240Webp.width,
        height: marcelaAvatar240Webp.height,
      },
      retrato: {
        avifSrcSet: `${marcelaRetrato720Avif.src} 720w, ${marcelaRetrato1080Avif.src} 1080w`,
        webpSrcSet: `${marcelaRetrato720Webp.src} 720w, ${marcelaRetrato1080Webp.src} 1080w`,
        src: marcelaRetrato720Webp.src,
        width: marcelaRetrato720Webp.width,
        height: marcelaRetrato720Webp.height,
      },
    },
  },
} as const;

export const AUTOR_SLUGS = Object.keys(AUTORES) as [
  keyof typeof AUTORES,
  ...(keyof typeof AUTORES)[],
];
