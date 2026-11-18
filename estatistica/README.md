# Probest P2 — Estatística

Site de estudo para a segunda parte de COE241 (Estatística e Modelos Probabilísticos): inferência bayesiana, MLE, intervalos de confiança e testes de hipótese, com exemplos resolvidos (diferentes dos das listas), exercícios de treino e calculadoras interativas.

## Estrutura

- `src/*.html` — conteúdo de cada página (só o miolo).
- `build.py` — junta o conteúdo com o template comum (menu, KaTeX, navegação) e gera os `.html` na raiz.
- `assets/site.css`, `assets/site.js` — estilo, funções numéricas (Φ, t, χ², Beta) e widgets.

Para editar: altere `src/…html` e rode `python3 build.py`.

## Publicar no GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → branch `main`, pasta `/ (root)`.
