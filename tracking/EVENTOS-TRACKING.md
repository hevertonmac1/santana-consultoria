# S2 Advogados — Medição (GA4 + GTM + Looker Studio)

Atualizado em 30/09/2026.

## Onde está cada coisa

| Item | Onde | Identificador |
|---|---|---|
| Propriedade GA4 | Conta Google Analytics "Hevertonmac", propriedade **S2 Advogados** | ID da propriedade 556764264 |
| Fluxo de dados web | https://www.s2advogados.com.br | ID de métrica **G-E55ZQDWEB7** |
| GTM | Conta "Marcela Advogada", contêiner www.s2advogados.com.br | GTM-TVP2DGX9 |
| Script do site | `public/s2-tracking.js` (chamado em `src/layouts/Layout.astro`) | — |
| Backup do contêiner importado | `tracking/gtm-s2-ga4-import.json` | — |

Fuso do GA4: São Paulo (GMT-03:00). Moeda: BRL.

## Como funciona

1. O script `s2-tracking.js` observa cliques, scroll e seções e faz
   `dataLayer.push({ event: 's2_evt', s2_event: '<nome>', ...parâmetros })`.
2. No GTM, o gatilho **Evento personalizado - s2_evt** dispara a tag **GA4 - Eventos S2**, que usa `s2_event` como nome do evento no GA4 e repassa os parâmetros.
3. A tag **GA4 - Configuração (Google tag)** envia page_view e mede tráfego, origem, dispositivo e cidade.
4. A tag de conversão do Google Ads ("Contato", gatilho: clique com a URL contendo 5534991692737) **não foi alterada**.

## Eventos enviados ao GA4

| Evento | Quando dispara | Parâmetros principais |
|---|---|---|
| `page_context` | 1x ao abrir a página | utm_*_page, has_gclid, referrer_host, viewport, lang |
| `first_interaction` | primeira ação do visitante | interaction_type (click/scroll), seconds_to_interact |
| `whatsapp_click` | qualquer clique em link de WhatsApp | click_location, cta_text, service, cta_type, seconds_on_page, max_scroll_pct |
| `cta_view` | botão de WhatsApp entrou 60% na tela | click_location, service, cta_text |
| `nav_click` | clique no menu / rodapé (âncoras) | nav_target, nav_label, click_location |
| `logo_click` | clique na logo | click_location |
| `slider_click` | setas do slider de serviços | slider, direction |
| `card_click` | clique em card sem link | click_location, card_title |
| `faq_toggle` | abrir/fechar pergunta do FAQ | faq_question, faq_index, faq_state |
| `section_view` | seção com 40% visível (1x) | section_name, seconds_on_page |
| `section_dwell` | 5, 15 e 30 s de atenção em uma seção | section_name, dwell_seconds |
| `scroll_depth` | 25, 50, 75, 90, 100% | scroll_percent, seconds_on_page |
| `engaged_time` | 10, 30, 60, 120, 180, 300 s com aba ativa | engaged_seconds |
| `copy_text` | usuário copiou texto (telefone, e-mail) | copy_type, copy_length, click_location |
| `phone_click` / `email_click` | links tel: e mailto: | click_location, cta_text |
| `outbound_click` | links para outros sites | link_host, link_url, click_location |
| `page_exit` | saída / aba escondida | engaged_seconds, max_scroll_pct, sections_viewed, top_section |
| `js_error` | erro de JavaScript no site | error_message, error_file |

Valores de `click_location`: header, hero, servicos, diferenciais, sobre_dra_marcela, como_funciona, faq, cta_final, footer, barra_flutuante_mobile.

Valores de `section_name`: hero, servicos, diferenciais, sobre_dra_marcela, como_funciona, faq, cta_final, footer.

## Registrado no GA4 (para usar no Looker Studio)

22 dimensões personalizadas (escopo evento): Local do clique, Serviço do botão, Texto do botão CTA, Tipo de CTA, Destino do menu, Pergunta do FAQ, Estado do FAQ, Seção da página, Seção mais vista, Tipo de dispositivo, Veio de anúncio gclid, Site de referência, Tipo de cópia, Card clicado, Direção do slider, Site externo clicado, Tipo de primeira interação, UTM campanha da página, UTM termo da página, Marco de scroll, Marco de atenção na seção, Marco de tempo engajado.

3 métricas personalizadas: Segundos na página, Scroll máximo percentual, Segundos até interagir, Seções vistas na visita.

Os dados de dimensões personalizadas só aparecem nos relatórios a partir do momento em que o evento chega ao GA4 (não é retroativo).

## Pendências para começar a coletar

1. Publicar o contêiner GTM (Enviar) para ativar page_view e a tag de eventos.
2. Fazer build e deploy do site para publicar `s2-tracking.js` e a chamada no Layout.
3. Depois do primeiro clique real em WhatsApp: no GA4, Administrador > Exibição de dados > Eventos, marcar `whatsapp_click` como evento principal (estrela).
4. Vincular o GA4 ao Google Ads (Administrador > Vínculos de produtos) para importar públicos e ver campanhas no GA4.
5. Conectar o GA4 no Looker Studio (fonte de dados "Google Analytics" > propriedade S2 Advogados).

## Ideias de painel (Looker Studio)

- Visão geral: usuários, sessões, origem/mídia/campanha, dispositivo, cidade.
- Funil: sessões > section_view (servicos, faq, cta_final) > whatsapp_click.
- WhatsApp: cliques por click_location e por service; taxa = whatsapp_click / sessões.
- Atenção: section_dwell por seção, scroll_depth, engaged_time.
- Interesse: faq_toggle por pergunta, slider_click, nav_click por destino.
- Tráfego pago: has_gclid = sim vs não, utm_campaign_page.
