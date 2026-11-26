---
title: "Artigo de teste da estrutura do blog"
description: "Documento técnico de validação do template de artigos, hierarquia tipográfica, tabelas, FAQ, CTA e dados estruturados do blog da S2 Advogados."
pubDate: 2026-11-26
keyword: "teste infraestrutura blog"
cluster: geral
tags: ["teste", "infraestrutura"]
author: marcela
heroAlt: ""
faq:
  - q: "Este artigo aparece em produção?"
    a: "Não. Por estar marcado como draft: true, ele aparece apenas no ambiente local de desenvolvimento (npm run dev) e não entra no build nem no sitemap."
  - q: "Como um artigo real é publicado?"
    a: "Após a revisão jurídica da Dra. Marcela Santana, o campo draft é alterado para false e o campo revisadoEm é preenchido com a data da aprovação."
draft: true
---

Este é um artigo técnico e neutro usado apenas para validar a renderização do blog em ambiente de desenvolvimento (`npm run dev`). Ele não contém texto jurídico e não é publicado no build de produção.

## Tipografia e hierarquia de títulos

O corpo do texto utiliza largura máxima de leitura próxima a 720 pixels, com entrelinha confortável e contraste adequado ao fundo creme do site.

### Lista de elementos validados

- Breadcrumb visual e `BreadcrumbList` em JSON-LD.
- Metadados da autora com vínculo para a seção institucional.
- Bloco de perguntas frequentes em `<details>` e `<summary>` sem JavaScript.
- Chamadas para ação com link de WhatsApp contendo o número oficial e referência do artigo.

> Exemplo de citação em bloco para validar o acabamento visual de destaques dentro do texto.

## Exemplo de tabela responsiva

| Campo do front matter | Função | Comportamento padrão |
|---|---|---|
| `draft` | Controla a publicação | `true` (rascunho seguro) |
| `cluster` | Agrupa temas relacionados | `geral` |
| `revisadoEm` | Exibe o selo de revisão jurídica | Oculto se vazio |

Este arquivo pode ser removido antes da publicação do primeiro artigo real, ou mantido com `draft: true` para testes locais.
