#!/usr/bin/env python3
"""Gera as páginas do site a partir de src/*.html (só o conteúdo) + template comum.

Uso: python3 build.py
"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"

# (arquivo, título curto no menu, título da aba, classe de cor)
PAGES = [
    ("index.html", "Início e roteiro", "Início", "s1"),
    ("01-amostras.html", "Da probabilidade à estatística", "Amostras e estimadores", "s1"),
    ("02-bayes-discreto.html", "Bayes com hipóteses discretas", "Bayes discreto", "s2"),
    ("03-preditiva-odds.html", "Probabilidade preditiva e odds", "Preditiva e odds", "s3"),
    ("04-bayes-continuo.html", "Priors contínuas e conjugadas", "Bayes contínuo", "s4"),
    ("05-map-priors.html", "MAP, escolha de priors, MAP × MLE", "MAP e priors", "s5"),
    ("06-mle.html", "Máxima verossimilhança (MLE)", "MLE", "s6"),
    ("07-intervalos.html", "Intervalos de confiança", "Intervalos de confiança", "s7"),
    ("08-nhst.html", "Testes de hipótese: fundamentos", "NHST: fundamentos", "s8"),
    ("09-testes.html", "Catálogo de testes (z, t, χ², F)", "Catálogo de testes", "s9"),
    ("10-razao-verossimilhanca.html", "Teste da razão de verossimilhança", "Razão de verossimilhança", "s10"),
    ("11-freq-bayes-regressao.html", "Frequentista × Bayesiano, bootstrap, regressão", "Comparações e extras", "s11"),
    ("12-exercicios.html", "Exercícios de treino (com solução)", "Exercícios", "s12"),
    ("13-formulario.html", "Formulário + tabelas interativas", "Formulário", "s13"),
    ("14-mapa-listas.html", "Mapa das listas, checklist e fontes", "Mapa das listas", "s14"),
]

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
<div class="pager">{prev}{next}</div>
</main>
</div>
</body>
</html>
"""


def main():
    for i, (fname, short, tab, cls) in enumerate(PAGES):
        body = (SRC / fname).read_text(encoding="utf-8")
        nav = "".join(
            f'<li><a href="{f}"{" aria-current=\"page\"" if f == fname else ""}>{s}</a></li>'
            for f, s, _, _ in PAGES
        )
        prev = f'<a href="{PAGES[i-1][0]}">← {PAGES[i-1][1]}</a>' if i > 0 else "<span></span>"
        nxt = f'<a href="{PAGES[i+1][0]}">{PAGES[i+1][1]} →</a>' if i + 1 < len(PAGES) else "<span></span>"
        html = TEMPLATE.format(tab=tab, cls=cls, nav=nav, body=body, prev=prev, next=nxt,
                               katex=KATEX, open="open" if fname == "index.html" else "")
        (ROOT / fname).write_text(html, encoding="utf-8")
        print("ok", fname)


if __name__ == "__main__":
    main()
