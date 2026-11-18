#!/usr/bin/env python3
"""Gera as páginas do site a partir de src/*.html (só o conteúdo) + template comum.

Uso: python3 build.py
"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"

# (arquivo, título curto no menu, título da aba, classe de cor)
PAGES = [
    ("index.html", "Início e roteiro", "Início", "s1", []),
    ("01-amostras.html", "Da probabilidade à estatística", "Amostras e estimadores", "s1", ["M10", "M19"]),
    ("02-bayes-discreto.html", "Bayes com hipóteses discretas", "Bayes discreto", "s2", ["M11", "MPS07"]),
    ("03-preditiva-odds.html", "Probabilidade preditiva e odds", "Preditiva e odds", "s3", ["M12", "MPS07"]),
    ("04-bayes-continuo.html", "Priors contínuas e conjugadas", "Bayes contínuo", "s4", ["M13", "M14", "M14S", "M15"]),
    ("05-map-priors.html", "MAP, escolha de priors, MAP × MLE", "MAP e priors", "s5", ["M15", "M16", "S1", "B2"]),
    ("06-mle.html", "Máxima verossimilhança (MLE)", "MLE", "s6", ["M10", "MEX2"]),
    ("07-intervalos.html", "Intervalos de confiança", "Intervalos de confiança", "s7", ["M22", "M23"]),
    ("08-nhst.html", "Testes de hipótese: fundamentos", "NHST: fundamentos", "s8", ["M17", "M18", "MPS08"]),
    ("09-testes.html", "Catálogo de testes (z, t, χ², F)", "Catálogo de testes", "s9", ["M18", "M19", "MEX2"]),
    ("10-razao-verossimilhanca.html", "Teste da razão de verossimilhança", "Razão de verossimilhança", "s10", ["M19", "B1"]),
    ("11-freq-bayes-regressao.html", "Frequentista × Bayesiano, bootstrap, regressão", "Comparações e extras", "s11", ["M20", "M24", "M26"]),
    ("12-exercicios.html", "Exercícios de treino (com solução)", "Exercícios", "s12", ["MEX2", "MPS07", "MPS08"]),
    ("13-formulario.html", "Formulário + tabelas interativas", "Formulário", "s13", ["MEX2"]),
    ("14-mapa-listas.html", "Mapa das listas, checklist e fontes", "Mapa das listas", "s14", []),
    ("15-materiais-mit.html", "Materiais: resumos das aulas do MIT", "Materiais do MIT", "s9", []),
]

# Arquivos da pasta pública da disciplina no Google Drive (código → (id, descrição curta))
DRIVE_FOLDER = "https://drive.google.com/drive/folders/1epRBrXuGYCBsixNzqd4vQqDMDyAh2PFo"
DRIVE = {
    "M10": ("1KlxN6zAnv-MLnhpaTUvTBKVZ5aame8yM", "MIT 10 · Intro to Statistics, MLE"),
    "M11": ("1-IfPV-srvMrLhYy4SMKkywMwIcA2ibZs", "MIT 11 · Bayesian Updating: Discrete Priors"),
    "M12": ("1Kpa0gQzUJ63kKbU5iG_hxIhTMJn6rWCV", "MIT 12 · Probabilistic Prediction; Odds"),
    "M13": ("1JZzKI6Iad26Wgm2oNSGRJQ4Eex-6gPiP", "MIT 13 · Continuous Priors"),
    "M14": ("1yuuRlktCwZvKz6AJkkwUYqzc73XvduaC", "MIT 14 · Continuous Data, Continuous Priors"),
    "M14S": ("1tc-VKJEqwlf_olcQQmqbPhTprIe5iyEr", "MIT 14 · slides"),
    "M15": ("1nkNUeimH00v3suIbVcsD3XPl-17bW-TV", "MIT 15 · Conjugate Priors: Beta and Normal"),
    "M16": ("1Pk-4I5S6gOVdQcJVH7u6k1-Lo0KdnzDy", "MIT 16 · Choosing Priors; Probability Intervals"),
    "M17": ("1sRg8Yf5wrXdysgxLNEd6xfCIRCrzq08I", "MIT 17 · Frequentist Statistics; NHST I"),
    "M18": ("1mXl05vSel9G9xbanlrAEYH4t8nTTnihO", "MIT 18 · NHST II"),
    "M19": ("1pZSuin7ng6X41yMcv-liQ2mc1IaEPoUr", "MIT 19 · NHST III"),
    "M20": ("15m6yYFBPkBm6RgtTouncJiMI_mbj-eba", "MIT 20 · Frequentist vs Bayesian"),
    "M22": ("1C8ey2eAuhxcs7SjyYGPNiWtbzs3tfgEM", "MIT 22 · Confidence Intervals: Normal Data"),
    "M23": ("1oaoGs7-fZOys_V_5ADz1RhiVv3Ry1ig0", "MIT 23 · Confidence Intervals: Three Views"),
    "M24": ("1W9Aq6PtByO_wQ1g_5xPbiRcVc5BJHLS9", "MIT 24 · Bootstrap Confidence Intervals"),
    "M26": ("1DRbcuGVnKbMtEJHFqJg9MvLV9RC7RBmq", "MIT 26 · Linear Regression"),
    "MEX2": ("1GrVVl5QZtlKpjc1ZMferBVI-sTk3rwMA", "MIT · Prática da Prova 2 (com tabelas)"),
    "MEX2G": ("1QqJq3wXWRIiaJaonbzpUTus8JRrpDAgb", "MIT · Prática da Prova 2 — solução"),
    "MPS07": ("19VDReHw4M21CBDhMrngrIIvf_fiGKai0", "MIT · Problem Set 7"),
    "MPS07G": ("1UHiKslL6FXSgwQZgUHgHt0ZUFDLWQk59", "MIT · Problem Set 7 — solução"),
    "MPS08": ("1yNr5VOHwgkVbtbKLts3g1KILiA0iKNZs", "MIT · Problem Set 8"),
    "MPS08G": ("1LS6IxX5KEmC76W62T4g2QaHNE5UskswE", "MIT · Problem Set 8 — solução"),
    "S1": ("19L2U3K5IBPNivC7pSjpPZALihdLej5ao", "Slides de MAP"),
    "B2": ("1dPw8-XJxWl-V2Eu0Ph0-Wiq_YI53FUul", "Tsun 7.5 · MAP Estimation"),
    "B1": ("1LckrMd55JUUzbXDYaRsfCMuZDrY65Va1", "Livro Pishro-Nik (PDF completo)"),
    "L03": ("1Nb8V3KKsByciabbw_dcDfaQ2bYXCVeQm", "Lista 3"),
    "L03G": ("1w1zevZpR8_RlVbkCjUJtHLfsXRE9wRxI", "Lista 3 — gabarito"),
    "L04": ("1RlrEuWGDI2Kmys1HA__-UmzVeKQjUXbn", "Lista 4"),
    "L05": ("1-Hey88AzO8K4kKyYFMjSJqxyILMeGpdF", "Lista 5"),
    "LMLE": ("17yRyo--qjCsMfsi2MPj322gUagn193bd", "Lista MLE"),
    "LMLEG": ("1ZyJsivcY8yYgSM0Ull_rAWnWQEcg6D7X", "Lista MLE — gabarito"),
    "P2": ("1UC2kRa6K_6zXryQe7irAKbvfMTQh12um", "Prova 2 antiga"),
}


def drive_url(code):
    return f"https://drive.google.com/file/d/{DRIVE[code][0]}/view"


def mit_links(codes):
    if not codes:
        return ""
    items = "".join(f'<a href="{drive_url(c)}" target="_blank" rel="noopener" title="{DRIVE[c][1]}">{c}</a>' for c in codes)
    return f'<div class="mit-links"><span>PDFs desta página (Drive):</span>{items}<a href="15-materiais-mit.html">resumos das aulas →</a></div>'

KATEX = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist"

TEMPLATE = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Estatística (P2) de Probabilidade e Estatística: inferência bayesiana, MLE, intervalos de confiança e testes de hipótese, com exemplos resolvidos.">
<title>{tab} · Probest P2</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='15' fill='%23176b87'/><text x='16' y='22' font-size='17' text-anchor='middle' fill='white' font-family='serif'>θ</text></svg>">
<link rel="stylesheet" href="{katex}/katex.min.css">
<link rel="stylesheet" href="assets/site.css">
<script defer src="{katex}/katex.min.js"></script>
<script defer src="{katex}/contrib/auto-render.min.js"></script>
<script defer src="assets/site.js"></script>
</head>
<body class="{cls}">
<header class="site-header"><a class="brand" href="index.html">Probest P2 · Estatística</a><span class="header-actions"><a class="switch" href="../index.html">↔ Trocar matéria</a><button class="theme-toggle" type="button" aria-label="Alternar tema claro/escuro">◐ tema</button></span></header>
<div class="page-wrap">
<nav class="site-nav" aria-label="Seções"><details {open}><summary>Seções do site</summary><ol start="0">{nav}</ol></details></nav>
<main class="content">
{body}
{links}
<div class="pager">{prev}{next}</div>
</main>
</div>
</body>
</html>
"""


def main():
    for i, (fname, short, tab, cls, codes) in enumerate(PAGES):
        body = (SRC / fname).read_text(encoding="utf-8")
        body = body.replace("{{DRIVE_FOLDER}}", DRIVE_FOLDER)
        for c in DRIVE:
            body = body.replace("{{" + c + "}}", drive_url(c))
        nav = "".join(
            f'<li><a href="{f}"{" aria-current=\"page\"" if f == fname else ""}>{s}</a></li>'
            for f, s, _, _, _ in PAGES
        )
        prev = f'<a href="{PAGES[i-1][0]}">← {PAGES[i-1][1]}</a>' if i > 0 else "<span></span>"
        nxt = f'<a href="{PAGES[i+1][0]}">{PAGES[i+1][1]} →</a>' if i + 1 < len(PAGES) else "<span></span>"
        html = TEMPLATE.format(tab=tab, cls=cls, nav=nav, body=body, prev=prev, next=nxt,
                               links=mit_links(codes), katex=KATEX, open="open" if fname == "index.html" else "")
        (ROOT / fname).write_text(html, encoding="utf-8")
        print("ok", fname)


if __name__ == "__main__":
    main()
