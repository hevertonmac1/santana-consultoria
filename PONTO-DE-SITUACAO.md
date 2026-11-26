# Santana & Advogados (S2Advogados) — Ponto de situação

> Arquivo de "boot" para novas conversas e para agentes (Antigravity, Orca, Claude, Codex).

## O que é
Site institucional e de conversão da **Santana & Advogados / Santana Consultoria** (Dra. Marcela Santana) — advocacia e consultoria jurídica especializada em Direito de Trânsito.

**Stack:** Astro 7 (`astro@^7.2.6`) + Lucide Icons (`@lucide/astro`) + CSS customizado.
**Repo:** `~/Projetos/S2Advogados` (`hevertonmac1/santana-consultoria`, deploy automático Vercel via `main`).

---

## 📌 Status Atual (26/11/2026)
- **Endereço profissional atualizado:** `R. Manoel Serralha, 569 — Santa Mônica, Uberlândia/MG, 38408-246` no rodapé (`Footer.astro`) e no JSON-LD (`Layout.astro`). Nenhuma referência ao endereço antigo permanece no projeto.
- **Otimização de imagens (`astro:assets` + `sharp`):**
  - Criado o componente reutilizável `src/components/OptimizedPicture.astro` (`<Picture>` com AVIF, WebP e fallback JPEG, suporte a `priority`, `widths` e `sizes`).
  - Qualidade configurada por formato no `astro.config.mjs` (AVIF 60, WebP 75, JPEG 80).
  - As 3 fotos da home (`escritorio-santana.jpg`, `marcela-quem-somos.png` e `escritorio-santana-estante.jpg`) passaram a ser importadas de `src/assets/img/` em `Hero.astro` (com `priority={true}`) e `SobreDraMarcela.astro` (`loading="lazy"`).
  - Logo do header (`Header.astro`) com `width="183" height="48"` explícitos.
  - `og:image` e `twitter:image` em `Layout.astro` atualizados para `https://www.s2advogados.com.br/escritorio-santana.jpg` (cópia preservada em `public/escritorio-santana.jpg` para compartilhamento social).
  - Fotos não utilizadas (`marcela-santana.jpg` e `marcela-equipe.jpg`) movidas de `public/` para `src/assets/img/nao-usadas/`.
- **Tracking preservado:** GTM (`GTM-TVP2DGX9`), GA4 (`G-E55ZQDWEB7`), `public/s2-tracking.js` e links de WhatsApp (`5534991692737`) intocados.

---

## 📋 Regras de Trabalho
- **Atualização Automática:** Atualizar este arquivo ao encerrar cada sessão relevante.
