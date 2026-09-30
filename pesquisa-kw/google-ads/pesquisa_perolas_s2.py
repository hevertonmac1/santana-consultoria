#!/usr/bin/env python3
"""
S2 Advogados — busca de "pérolas": keywords de cauda longa, CPC baixo e pouca concorrência.
Usa a mesma conta/credenciais do DataForSEO das ferramentas do Backup Design (tools/.env).
Uso (no Terminal do Mac):
    cd ~/Projetos/S2Advogados/pesquisa-kw/google-ads
    python3 pesquisa_perolas_s2.py
Saída: 4_perolas_s2_<data>.csv  e  4_perolas_s2_<data>.md (nesta mesma pasta)
Custo estimado: ~US$ 0,50 a 1,50 (chamadas Labs + Google Ads volume).
"""
import base64, csv, json, os, re, sys, datetime
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from pathlib import Path

ENV = Path.home() / "Projetos" / "backup-design" / "tools" / ".env"
env = {}
for l in ENV.read_text().splitlines():
    l = l.strip()
    if l and not l.startswith("#") and "=" in l:
        k, v = l.split("=", 1); env[k.strip()] = v.strip().strip('"').strip("'")
CRED = base64.b64encode(f"{env['DATAFORSEO_LOGIN']}:{env['DATAFORSEO_PASSWORD']}".encode()).decode()
LOC, LANG = 2076, "pt"   # Brasil / português

def call(ep, payload):
    r = Request("https://api.dataforseo.com/v3/" + ep, data=json.dumps(payload).encode(), method="POST")
    r.add_header("Authorization", "Basic " + CRED); r.add_header("Content-Type", "application/json")
    try:
        return json.loads(urlopen(r, timeout=120).read())
    except HTTPError as e:
        print("HTTP", e.code, e.read().decode()[:300], file=sys.stderr); return {}
    except Exception as e:
        print("ERRO", e, file=sys.stderr); return {}

# ---- Sementes ligadas DIRETAMENTE aos serviços da S2 (recurso de multas + suspensão/cassação) ----
SEEDS = [
 "recurso de multa de trânsito", "defesa prévia multa", "recurso multa excesso de velocidade", "recurso multa radar",
 "recurso multa lei seca", "recusa bafômetro multa recurso", "recurso multa avanço de sinal", "recurso multa celular volante",
 "recurso multa estacionamento irregular", "multa não indicação de condutor", "recurso multa gravíssima", "prescrição multa de trânsito",
 "recurso jari multa", "recurso cetran multa", "notificação de autuação recurso", "notificação de penalidade recurso",
 "advogado especialista multa de trânsito", "advogado de trânsito online", "advogado multa trânsito preço",
 "cnh suspensa como recorrer", "suspensão do direito de dirigir recurso", "processo suspensão direito de dirigir defesa",
 "cassação da cnh recurso", "20 pontos na cnh o que fazer", "pontos na cnh recurso advogado", "bloqueio da cnh advogado",
 "advogado cnh suspensa", "mandado de segurança cnh suspensa", "defesa administrativa suspensão cnh", "recurso suspensão cnh detran",
 "cnh cassada advogado", "multa lei seca advogado", "recusa bafômetro suspensão cnh", "dirigir com cnh suspensa",
]
# termos que NÃO interessam (curiosos, DIY, governo, autoescola etc.)
BAD = re.compile(r"\b(gr[aá]tis|gratuit|modelo|pdf|como fazer|sozinho|passo a passo|simulado|curso|apostila|concurso|emprego|vaga|sal[aá]rio|"
                 r"autoescola|auto escola|renovar|renova[cç][aã]o|segunda via|primeira habilita|tirar cnh|consultar|pagar|parcel|desconto|telefone|"
                 r"site|agendamento|gov|app|aplicativo|digital|oab|jurisprud|peti[cç][aã]o|carta|exemplo|o que [eé]|quanto custa|detran (mg|sp|rj|pr|rs|ba|go|sc|pe|ce|df|es))\b", re.I)
GOOD = re.compile(r"(multa|cnh|habilita|carteira|pontos|suspens|cassa|bafômetro|bafometro|lei seca|jari|cetran|autua|penalidade|condutor|direito de dirigir|advogad|recurso|defesa|radar|velocidade)", re.I)

def suggestions(seed):
    p = [{"keyword": seed, "location_code": LOC, "language_code": LANG, "include_seed_keyword": True, "limit": 300,
          "order_by": ["keyword_info.search_volume,desc"]}]
    d = call("dataforseo_labs/google/keyword_suggestions/live", p)
    try: return d["tasks"][0]["result"][0].get("items") or []
    except Exception: return []

def ideas(seeds):
    out = []
    for i in range(0, len(seeds), 20):
        p = [{"keywords": seeds[i:i+20], "location_code": LOC, "language_code": LANG, "limit": 700,
              "order_by": ["keyword_info.search_volume,desc"]}]
        d = call("dataforseo_labs/google/keyword_ideas/live", p)
        try: out += d["tasks"][0]["result"][0].get("items") or []
        except Exception: pass
    return out

pool = {}
def add(items):
    for it in items:
        kw = it.get("keyword"); ki = it.get("keyword_info") or {}
        if not kw: continue
        pool[kw] = ki

print("Buscando sugestões (%d sementes)..." % len(SEEDS))
for s in SEEDS:
    add(suggestions(s)); print(" ok:", s)
print("Buscando ideias..."); add(ideas(SEEDS))
print("Candidatas brutas:", len(pool))

cands = [k for k in pool if GOOD.search(k) and not BAD.search(k)]
# dados oficiais do Google Ads (CPC / lance de topo / concorrência) para as candidatas
rows = []
for i in range(0, len(cands), 700):
    chunk = cands[i:i+700]
    d = call("keywords_data/google_ads/search_volume/live",
             [{"keywords": chunk, "location_code": LOC, "language_code": LANG, "search_partners": False}])
    try:
        for t in d["tasks"][0]["result"] or []:
            rows.append(t)
    except Exception: pass

final = []
for r in rows:
    kw = r.get("keyword"); vol = r.get("search_volume") or 0
    cpc = r.get("cpc"); comp = r.get("competition"); idx = r.get("competition_index")
    low = r.get("low_top_of_page_bid"); high = r.get("high_top_of_page_bid")
    if vol < 20: continue
    words = len(kw.split())
    est = cpc if cpc else (low or 0)
    final.append(dict(keyword=kw, volume=vol, cpc_brl=round(est or 0, 2), low_bid=round(low or 0, 2), high_bid=round(high or 0, 2),
                      concorrencia=comp or "", indice=idx if idx is not None else "", palavras=words,
                      pontuacao=round(vol / max(est or 0.5, 0.5), 1)))
final.sort(key=lambda x: -x["pontuacao"])

today = datetime.date.today().isoformat()
base = Path(__file__).parent
with open(base / f"4_perolas_s2_{today}.csv", "w", newline="", encoding="utf-8-sig") as f:
    w = csv.DictWriter(f, fieldnames=list(final[0].keys()) if final else ["keyword"]); w.writeheader(); w.writerows(final)

with open(base / f"4_perolas_s2_{today}.md", "w", encoding="utf-8") as f:
    f.write(f"# Pérolas S2 — {today}\n\nOrdenado por pontuação = volume / CPC (quanto maior, mais barato por busca).\n"
            "CPC atual médio das campanhas: ~R$ 10,91 (Multas ~R$ 8,7 | Suspensão ~R$ 15).\n\n")
    f.write("| Keyword | Vol/mês | CPC R$ | Lance topo R$ (baixo–alto) | Concorrência | Palavras |\n|---|---|---|---|---|---|\n")
    for x in final[:120]:
        f.write(f"| {x['keyword']} | {x['volume']} | {x['cpc_brl']} | {x['low_bid']}–{x['high_bid']} | {x['concorrencia']} ({x['indice']}) | {x['palavras']} |\n")
print(f"\nPronto! {len(final)} keywords. Arquivos: 4_perolas_s2_{today}.csv / .md nesta pasta.")
