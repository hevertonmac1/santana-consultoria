# Santana & Advogados (S2Advogados) — Ponto de situação

> Arquivo de "boot" para novas conversas e para agentes (Antigravity, Orca, Claude, Codex).

## O que é
Site institucional e de conversão da **Santana & Advogados / Santana Consultoria** (Dra. Marcela Santana) — advocacia e consultoria jurídica especializada em Direito de Trânsito.

**Stack:** Astro 7 (`astro@^7.2.6`) + Lucide Icons (`@lucide/astro`) + CSS customizado.
**Repo:** `~/Projetos/S2Advogados` (`hevertonmac1/santana-consultoria`, deploy automático Vercel via `main`).

---

## 📌 Status Atual (26/11/2026)
- **Endereço profissional atualizado:** `R. Manoel Serralha, 569 — Santa Mônica, Uberlândia/MG, 38408-246` no rodapé (`Footer.astro`) e no JSON-LD (`Layout.astro`).
- **Otimização de imagens (`astro:assets` + `sharp`):**
  - Componente reutilizável `src/components/OptimizedPicture.astro` (`<Picture>` com AVIF/WebP + fallback JPEG, suporte a `priority`, `widths` e `sizes`).
  - Qualidade configurada por formato no `astro.config.mjs` (AVIF 60, WebP 75, JPEG 80).
  - `og:image` e `twitter:image` apontando para `https://www.s2advogados.com.br/escritorio-santana.jpg`.
- **Infraestrutura do Blog (`/blog`):**
  - Constantes centralizadas em `src/data/site.ts` (`SITE_URL`, `WHATSAPP_NUMBER`, `buildWhatsAppUrl`) e autores em `src/data/autores.ts` (Dra. Marcela Santana, cargo `Advogada`, OAB/MG 220.180).
  - Coleção de conteúdo `blog` em `src/content.config.ts` (`astro:content`, `astro/loaders`, `astro/zod`) com `draft: true` por padrão.
  - Páginas `src/pages/blog/index.astro` (listagem com estado vazio amigável e preview de rascunhos em DEV) e `src/pages/blog/[...slug].astro` (artigo com breadcrumb, metadados, selo condicional `revisadoEm`, capa opcional via `OptimizedPicture`, corpo ~720px, CTA intermediário e final com WhatsApp `(Ref: blog-<slug>)`, FAQ `<details>`, relacionados, paginação e JSON-LD `@graph`).
  - `Layout.astro` estendido com props opcionais (`type`, `canonical`, `ogImage`, `publishedTime`, `modifiedTime`, `articleAuthor`, `articleTags`, `includeFaqSchema`, `robots`, `pageVariant`, `articleSlug`, `articleCluster` e `<slot name="head" />`), preservando a home intacta.
  - Navegação atualizada (`Header.astro` e `Footer.astro`) com link "Blog" e âncoras `/#...`; `MobileFloatWpp.astro` incluído nas páginas do blog.
  - SEO técnico: `src/pages/sitemap.xml.ts` (sem dependência externa, excluindo rascunhos) e `public/robots.txt`.
  - Tracking (`public/s2-tracking.js` e `tracking/EVENTOS-TRACKING.md`) estendido para o blog (`blog`, `artigo`, `cta_artigo_meio`, `cta_artigo_final`, `faq_artigo`, `artigo_meio`, `artigo_final`, `page_variant`, `article_slug`, `article_cluster`).
  - Artigo técnico de teste em `src/content/blog/_teste-infra.md` (`draft: true`, só aparece em DEV).
  - Pasta `.seo/revisao/` criada.

## ⏳ Pendências / Decisões abertas
- Adicionar os anexos `.seo/perfil.md` e `.seo/pauta.md` (não estavam em `~/Downloads` durante a execução).
- Confirmar domínio principal (`https://s2advogados.com.br` vs `https://www.s2advogados.com.br`) e unificar `og:image`.
- Confirmar com a Dra. Marcela o cargo exibido na assinatura dos artigos (atualmente `Advogada`).
- Revisar com a Dra. Marcela o texto do FAQ da home (linguagem de promessa no `faqSchema` / `Faq.astro`).
- Cadastrar `page_variant`, `article_slug` e `article_cluster` como dimensões personalizadas no GA4 se desejar relatórios por artigo.
- Remover `src/content/blog/_teste-infra.md` antes ou depois de publicar o primeiro artigo real (com `draft: true` ele nunca vai para produção).

---

## 📋 Regras de Trabalho
- **Atualização Automática:** Atualizar este arquivo ao encerrar cada sessão relevante.
