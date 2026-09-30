# Guia — Subir as campanhas da Marcela Santana Advogada (Google Ads Editor)

Conta: **Marcela Santana Advogada** (ocid 1528679219). Duas campanhas novas de Pesquisa, **separadas**, cada uma R$ 30/dia, geo Uberlândia + Triângulo/MG, conversão no WhatsApp. Mesma montagem que usamos no DespachaMinas, adaptada para advocacia (OAB) e com a copy limpa de "CNH/carteira/governo".

> **Regra:** subir tudo **PAUSADO / como rascunho**. Nada vai ao ar sem o Heverton mandar. A decisão de ativar é dele.

**Arquivos desta pasta:**
- `1_keywords.csv` — 2 campanhas, 1 grupo cada, palavras-chave (frase + exata)
- `2_anuncios_rsa.csv` — 1 anúncio responsivo por campanha (copy compliance-safe, sem citar CNH/carteira/DETRAN)
- `3_negativas.csv` — negativas por campanha

---

## Passo 1 — Criar a "casca" das 2 campanhas (na mão, antes de importar)

No Google Ads Editor: selecione a conta **Marcela Santana Advogada** → **Obter alterações recentes**. Depois **Campanhas → Adicionar campanha**, e crie as DUAS com estas configs (só muda o nome):

**Nomes (exatos — os CSVs encaixam por este nome):**
- `S2 | Search | Recurso de Multas`
- `S2 | Search | Suspensão de CNH`  *(nome interno; o anúncio não cita CNH)*

**Configuração idêntica para as duas:**
- **Status:** **Pausada** (subir tudo pausado).
- **Tipo:** Rede de Pesquisa. **Desmarque** "Incluir Rede de Display" e "parceiros de pesquisa".
- **Orçamento diário:** R$ 30.
- **Estratégia de lances:** **CPC manual** (controle total no orçamento pequeno).
  - Lance máx. de CPC sugerido: **Multas R$ 10,00** · **Suspensão R$ 18,00** (CPC do nicho é alto — recurso de multa ~R$ 7,74, cnh suspensa ~R$ 16,70; o teto só limita, você paga o preço do leilão).
- **Locais:** Uberlândia + **Triângulo Mineiro** (adicione Uberlândia, Uberaba, Araguari, Ituiutaba, Patos de Minas e cidades próximas; ou selecione a região "Triângulo Mineiro"). Em opções de local, escolha **"Presença: pessoas que estão ou frequentam regularmente"** (não "interesse").
  - *Obs.: a Marcela atende online. Se quiser abrir para MG inteiro ou Brasil depois, é só ampliar o local — mas comece focado para gerar dado limpo com o orçamento pequeno.*
- **Idioma:** Português.
- **Horário:** Segunda a Sábado, 7h–20h (quando ela responde o WhatsApp — ajuste se for diferente).
- **Rotação de anúncios:** "Otimizar" está ok (1 RSA por grupo).

## Passo 2 — Importar keywords, anúncios e negativas

1. **Conta → Importar → Do arquivo…**
2. Importe **`1_keywords.csv`** → cria os 2 grupos e as palavras-chave. Revise em verde.
3. Importe **`2_anuncios_rsa.csv`** → cria 1 RSA por campanha, apontando para a home (`https://s2advogados.com.br/`).
4. Importe **`3_negativas.csv`** → adiciona as negativas em cada campanha (confirme "negativas da campanha" se o Editor perguntar).
5. Revise tudo e clique em **Publicar (Postar)** — as campanhas sobem **pausadas**.

## Passo 3 — Ajustes que só dá pra fazer no painel (ads.google.com)

- **Conversão de WhatsApp:** o site ainda **não tem** o evento de clique no WhatsApp configurado. Antes de ativar, instalar o `whatsapp_click` (GTM) e marcar como conversão principal das 2 campanhas — senão o Google otimiza às cegas. (Posso preparar o passo a passo do GTM.)
- **Extensões (reforçam o anúncio):**
  - Frases de destaque: "Atendimento online", "Advogada com OAB ativa", "Defesa técnica no CTB", "Recurso nos prazos".
  - Recurso de chamada: (34) 99169-2737.
  - Sitelinks: "Recurso de Multas", "Suspensão por Pontos", "Recursos Administrativos". **Não** usar sitelink que cite órgão do governo.
- **Logo/identidade:** confirmar que o logo da Santana aparece nas campanhas.

---

## Compliance — o que observar (importante nesse nicho)

- **Política do Google (documentos/serviços do governo):** categoria fiscalizada de perto. Os anúncios não citam CNH/carteira/DETRAN de propósito, e a landing page tem o aviso de isenção de vínculo. Se algum anúncio reprovar, **peça revisão manual** — não é garantia, mas a copy está no enquadramento para maximizar aprovação.
- **OAB (Provimento 205/2021):** a copy evita promessa de resultado, tom mercantil e "especialista". Mantenha assim. A palavra final sobre o que pode ser publicado é da Dra. Marcela.
- Como são **campanhas separadas**, uma reprovação numa não derruba a outra.

## Depois de ativar (quando o Heverton decidir)

- Com CPC alto e R$ 30/dia, espere **~2–4 cliques/dia por campanha**. Dê 1–2 semanas antes de julgar.
- Revise o **relatório de termos de pesquisa** e vá somando negativas do que vier fora do alvo.
- Só migrar para lances automáticos ("Maximizar conversões") depois de ~15–30 conversas.

## Checklist antes de ativar
- [ ] Campanhas **pausadas** ao subir
- [ ] Nomes exatamente como acima
- [ ] Rede de Display desmarcada nas duas
- [ ] Locais = Uberlândia + Triângulo/MG, opção "presença no local"
- [ ] Orçamento R$ 30/dia cada; CPC manual (teto Multas R$ 10 / Suspensão R$ 18)
- [ ] Conversão de WhatsApp instalada e marcada como principal
- [ ] Anúncios revisados (nenhum cita CNH/carteira/governo)
