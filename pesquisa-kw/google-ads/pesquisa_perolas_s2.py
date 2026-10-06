#!/usr/bin/env python3
"""
S2 Advogados — busca de "pérolas": keywords de cauda longa, CPC baixo e pouca concorrência.

REGRA PADRÃO (Heverton): toda pesquisa de keyword no DataForSEO é gravada na ferramenta
Prospect (Supabase: tabelas keyword_searches + keywords), pra aparecer no histórico da aba Tráfego.

Uso (Terminal do Mac):
    cd ~/Projetos/S2Advogados/pesquisa-kw/google-ads
    python3 pesquisa_perolas_s2.py                # pesquisa + salva no Prospect + gera CSV/MD
    python3 pesquisa_perolas_s2.py --sem-salvar   # só CSV/MD (não grava no Supabase)

Credenciais: lidas de ~/Projetos/backup-design/backup-design-prospect/.env.local
    DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

Custo estimado DataForSEO: ~US$ 0,50 a 1,50.
"""
import base64, csv, json, re, sys, datetime
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from pathlib import Path

SALVAR = "--sem-salvar" not in sys.argv
ENV = Path.home() / "Projetos" / "backup-design" / "backup-design-prospect" / ".env.local"

env = {}
for l in ENV.read_text().splitlines():
    l = l.strip()
    if l and not l.startswith("#") and "=" in l:
        k, v = l.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

CRED = base64.b64encode(f"{env['DATAFORSEO_LOGIN']}:{env['DATAFORSEO_PASSWORD']}".encode()).decode()
LOC, LANG, MARKET = 2076, "pt", "BR"   # Brasil / português


def call(ep, payload):
    r = Request("https://api.dataforseo.com/v3/" + ep, data=json.dumps(payload).encode(), method="POST")
    r.add_header("Authorization", "Basic " + CRED)
    r.add_header("Content-Type", "application/json")
    try:
        return json.loads(urlopen(r, timeout=120).read())
    except HTTPError as e:
        print("HTTP", e.code, e.read().decode()[:300], file=sys.stderr)
        return {}
    except Exception as e:
        print("ERRO", e, file=sys.stderr)
        return {}


def usd_to_brl():
    try:
        d = json.loads(urlopen("https://open.er-api.com/v6/latest/USD", timeout=15).read())
        return float(d["rates"]["BRL"])
    except Exception:
        return 5.5


RATE = usd_to_brl()
print(f"Cotação USD→BRL: {RATE:.2f}")

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
    try:
        return d["tasks"][0]["result"][0].get("items") or []
    except Exception:
        return []


def ideas(seeds):
    out = []
    for i in range(0, len(seeds), 20):
        p = [{"keywords": seeds[i:i + 20], "location_code": LOC, "language_code": LANG, "limit": 700,
              "order_by": ["keyword_info.search_volume,desc"]}]
        d = call("dataforseo_labs/google/keyword_ideas/live", p)
        try:
            out += d["tasks"][0]["result"][0].get("items") or []
        except Exception:
            pass
    return out


pool = set()


def add(items):
    for it in items:
        kw = it.get("keyword")
        if kw:
            pool.add(kw.strip().lower())


print("Buscando sugestões (%d sementes)..." % len(SEEDS))
for s in SEEDS:
    add(suggestions(s))
    print(" ok:", s)
print("Buscando ideias...")
add(ideas(SEEDS))
print("Candidatas brutas:", len(pool))

cands = [k for k in pool if GOOD.search(k) and not BAD.search(k)]
print("Após filtros:", len(cands))

# dados oficiais do Google Ads (CPC / lance de topo / concorrência)
rows = []
for i in range(0, len(cands), 700):
    chunk = cands[i:i + 700]
    d = call("keywords_data/google_ads/search_volume/live",
             [{"keywords": chunk, "location_code": LOC, "language_code": LANG, "search_partners": False}])
    try:
        rows += d["tasks"][0]["result"] or []
    except Exception:
        pass

final = []
for r in rows:
    kw = (r.get("keyword") or "").strip().lower()
    vol = r.get("search_volume") or 0
    if not kw or vol < 20:
        continue
    cpc_usd = r.get("cpc") or 0
    low = r.get("low_top_of_page_bid") or 0
    high = r.get("high_top_of_page_bid") or 0
    est_usd = cpc_usd if cpc_usd else low
    lvl = r.get("competition") if r.get("competition") in ("LOW", "MEDIUM", "HIGH") else "LOW"
    idx = r.get("competition_index")
    comp = (idx / 100.0) if isinstance(idx, (int, float)) else {"HIGH": 0.8, "MEDIUM": 0.5, "LOW": 0.2}[lvl]
    est_brl = round(est_usd * RATE, 2)
    final.append(dict(keyword=kw, volume=vol, cpc_brl=est_brl,
                      low_bid=round(low * RATE, 2), high_bid=round(high * RATE, 2),
                      concorrencia=lvl, indice=idx if idx is not None else "", competition=comp,
                      palavras=len(kw.split()), dificuldade=0,
                      pontuacao=round(vol / max(est_brl, 0.5), 1),
                      trend=r.get("monthly_searches")))
final.sort(key=lambda x: -x["pontuacao"])

# dificuldade (0-100) para as melhores 700 — mesma métrica da aba Tráfego (isOpportunity = vol>=150 e dif<=35)
top = final[:700]
if top:
    d = call("dataforseo_labs/google/bulk_keyword_difficulty/live",
             [{"keywords": [x["keyword"] for x in top], "location_code": LOC, "language_code": LANG}])
    try:
        dm = {i["keyword"].strip().lower(): int(i.get("keyword_difficulty") or 0)
              for i in d["tasks"][0]["result"][0]["items"] if i.get("keyword")}
        for x in top:
            x["dificuldade"] = dm.get(x["keyword"], 0)
    except Exception:
        print("Aviso: não consegui a dificuldade (seguindo com 0).", file=sys.stderr)

today = datetime.date.today().isoformat()
base = Path(__file__).parent

# ---- Arquivos locais ----
csv_fields = ["keyword", "volume", "cpc_brl", "low_bid", "high_bid", "concorrencia", "indice", "dificuldade", "palavras", "pontuacao"]
with open(base / f"4_perolas_s2_{today}.csv", "w", newline="", encoding="utf-8-sig") as f:
    w = csv.DictWriter(f, fieldnames=csv_fields, extrasaction="ignore")
    w.writeheader()
    w.writerows(final)

with open(base / f"4_perolas_s2_{today}.md", "w", encoding="utf-8") as f:
    f.write(f"# Pérolas S2 — {today}\n\nOrdenado por pontuação = volume / CPC (R$). Valores em BRL (cotação {RATE:.2f}).\n"
            "CPC atual médio das campanhas: ~R$ 10,91 (Multas ~R$ 8,7 | Suspensão ~R$ 15).\n\n")
    f.write("| Keyword | Vol/mês | CPC R$ | Lance topo R$ | Concorrência | Dific. | Palavras |\n|---|---|---|---|---|---|---|\n")
    for x in final[:120]:
        f.write(f"| {x['keyword']} | {x['volume']} | {x['cpc_brl']} | {x['low_bid']}–{x['high_bid']} | "
                f"{x['concorrencia']} ({x['indice']}) | {x['dificuldade']} | {x['palavras']} |\n")

# ---- Grava na ferramenta Prospect (Supabase) ----
if SALVAR and final:
    sb = env["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/") + "/rest/v1"
    key = env["SUPABASE_SERVICE_ROLE_KEY"]

    def sb_post(table, body, ret=False):
        r = Request(f"{sb}/{table}", data=json.dumps(body).encode(), method="POST")
        r.add_header("apikey", key)
        r.add_header("Authorization", "Bearer " + key)
        r.add_header("Content-Type", "application/json")
        r.add_header("Prefer", "return=representation" if ret else "return=minimal")
        return json.loads(urlopen(r, timeout=60).read() or "null")

    try:
        seed = f"s2 advogados | pérolas trânsito | {today}"
        now = datetime.datetime.utcnow().isoformat() + "Z"
        total = sum(x["volume"] for x in final)
        srow = sb_post("keyword_searches", {"seed": seed, "market": MARKET, "total_volume": total}, ret=True)
        sid = srow[0]["id"]
        batch = [{"search_id": sid, "keyword": x["keyword"], "volume": x["volume"], "cpc": x["cpc_brl"],
                  "competition": x["competition"], "competition_level": x["concorrencia"],
                  "difficulty": x["dificuldade"], "trend": x["trend"], "fetched_at": now} for x in final]
        for i in range(0, len(batch), 400):
            sb_post("keywords", batch[i:i + 400])
        print(f"\nSalvo na ferramenta Prospect: '{seed}' ({len(batch)} keywords). Abra a aba Tráfego > histórico.")
    except HTTPError as e:
        print("ERRO ao salvar no Supabase:", e.code, e.read().decode()[:400], file=sys.stderr)
        print("Os arquivos CSV/MD foram gerados normalmente.", file=sys.stderr)
    except Exception as e:
        print("ERRO ao salvar no Supabase:", e, file=sys.stderr)

print(f"\nPronto! {len(final)} keywords. Arquivos: 4_perolas_s2_{today}.csv / .md nesta pasta.")
