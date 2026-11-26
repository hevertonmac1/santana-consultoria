export const AUTORES = {
  marcela: {
    nome: 'Dra. Marcela Santana',
    nomeSchema: 'Marcela Santana',
    cargo: 'Advogada',
    credencial: 'OAB/MG 220.180',
    url: '/#dra-marcela',
  },
} as const;

export const AUTOR_SLUGS = Object.keys(AUTORES) as [
  keyof typeof AUTORES,
  ...(keyof typeof AUTORES)[],
];
