# Resumo do livro — Probabilidade

> Síntese direta dos capítulos 1 a 7 de *Introduction to Probability, Statistics, and Random Processes*, de Hossein Pishro-Nik. Esta página cobre somente probabilidade; inferência estatística, estimação, intervalos de confiança, testes e regressão não fazem parte deste resumo.

## 1. Fundamentos

### Experimento, espaço amostral e eventos

- **Experimento aleatório:** procedimento cujo resultado não é conhecido de antemão.
- **Espaço amostral** \(\Omega\): conjunto de todos os resultados possíveis.
- **Evento:** subconjunto \(A\subseteq\Omega\).
- **Complemento:** \(A^c=\Omega\setminus A\).
- **União:** \(A\cup B\), ocorre pelo menos um dos eventos.
- **Interseção:** \(A\cap B\), ocorrem ambos.
- **Eventos disjuntos:** \(A\cap B=\varnothing\).

Leis de De Morgan:

\[
(A\cup B)^c=A^c\cap B^c,
\qquad
(A\cap B)^c=A^c\cup B^c.
\]

### Axiomas e identidades

\[
P(A)\ge0,
\qquad P(\Omega)=1,
\qquad
P\!\left(\bigcup_i A_i\right)=\sum_iP(A_i)
\]

na última igualdade, para eventos \(A_i\) disjuntos. Consequências:

\[
P(\varnothing)=0,
\qquad P(A^c)=1-P(A),
\]

\[
P(A\cup B)=P(A)+P(B)-P(A\cap B),
\]

\[
P\!\left(\bigcup_{i=1}^n A_i\right)
=\sum_{k=1}^n(-1)^{k+1}
\sum_{1\le i_1<\cdots<i_k\le n}
P(A_{i_1}\cap\cdots\cap A_{i_k})
\quad\text{(inclusão–exclusão)}.
\]

\[
P(A\setminus B)=P(A)-P(A\cap B),
\qquad
P(A\cup B)\le P(A)+P(B).
\]

Em um espaço finito equiprovável, \(P(A)=|A|/|\Omega|\).

### Probabilidade condicional, independência e Bayes

Para \(P(B)>0\):

\[
P(A\mid B)=\frac{P(A\cap B)}{P(B)},
\qquad
P(A\cap B)=P(A\mid B)P(B).
\]

Regra da cadeia:

\[
P(A_1\cap\cdots\cap A_n)
=P(A_1)\prod_{i=2}^nP(A_i\mid A_1\cap\cdots\cap A_{i-1}).
\]

Os eventos \(A\) e \(B\) são independentes quando

\[
P(A\cap B)=P(A)P(B).
\]

Independência condicional dado \(C\):

\[
P(A\cap B\mid C)=P(A\mid C)P(B\mid C).
\]

Se \(B_1,\ldots,B_m\) é uma partição de \(\Omega\), então:

\[
P(A)=\sum_{i=1}^mP(A\mid B_i)P(B_i)
\quad\text{(lei da probabilidade total)},
\]

\[
P(B_j\mid A)=
\frac{P(A\mid B_j)P(B_j)}
{\sum_iP(A\mid B_i)P(B_i)}
\quad\text{(regra de Bayes)}.
\]

Em Bayes, \(P(B_j)\) é a priori, \(P(A\mid B_j)\) é a verossimilhança, \(P(A)\) é a evidência e \(P(B_j\mid A)\) é a posteriori.

## 2. Contagem

| Situação: escolher \(k\) posições a partir de \(n\) tipos | Número de resultados |
|---|---:|
| Ordem importa, com repetição | \(n^k\) |
| Ordem importa, sem repetição | \(P(n,k)=\dfrac{n!}{(n-k)!}\) |
| Ordem não importa, sem repetição | \(\binom nk=\dfrac{n!}{k!(n-k)!}\) |
| Ordem não importa, com repetição | \(\binom{n+k-1}{k}\) |

Permutações de \(n\) objetos com grupos repetidos de tamanhos \(n_1,\ldots,n_r\):

\[
\frac{n!}{n_1!\cdots n_r!},
\qquad n_1+\cdots+n_r=n.
\]

Coeficiente multinomial:

\[
\binom{n}{n_1,\ldots,n_r}=\frac{n!}{n_1!\cdots n_r!}.
\]

Identidades úteis:

\[
\binom nk=\binom n{n-k},
\qquad
\binom nk=\binom{n-1}{k}+\binom{n-1}{k-1},
\qquad
\sum_{k=0}^n\binom nk=2^n.
\]

## 3. Uma variável aleatória

Uma **variável aleatória** é uma função \(X:\Omega\to\mathbb R\). Seu suporte é o conjunto de valores que pode assumir.

### Caso discreto

\[
p_X(x)=P(X=x),
\qquad p_X(x)\ge0,
\qquad \sum_xp_X(x)=1.
\]

\[
F_X(x)=P(X\le x)=\sum_{u\le x}p_X(u).
\]

Nos pontos de massa:

\[
p_X(x)=F_X(x)-F_X(x^-),
\qquad
F_X(x^-)=\lim_{t\uparrow x}F_X(t).
\]

### Caso contínuo

\[
f_X(x)\ge0,
\qquad \int_{-\infty}^{\infty}f_X(x)\,dx=1,
\]

\[
F_X(x)=\int_{-\infty}^{x}f_X(t)\,dt,
\qquad
P(a<X\le b)=F_X(b)-F_X(a).
\]

Quando a derivada existe, \(f_X(x)=F_X'(x)\). Para uma variável contínua, \(P(X=x)=0\); a densidade não é uma probabilidade pontual e pode ser maior que 1.

Toda CDF é não decrescente, contínua à direita e satisfaz
\[
\lim_{x\to-\infty}F_X(x)=0,
\qquad
\lim_{x\to\infty}F_X(x)=1.
\]

### Esperança, momentos e variância

\[
E[g(X)]=\sum_xg(x)p_X(x)
\quad\text{ou}\quad
E[g(X)]=\int_{-\infty}^{\infty}g(x)f_X(x)\,dx.
\]

\[
\mu=E[X],
\qquad
E[X^k]\text{ é o momento de ordem }k,
\]

\[
Var(X)=E[(X-\mu)^2]=E[X^2]-E[X]^2,
\qquad
\sigma_X=\sqrt{Var(X)}.
\]

\[
E[aX+b]=aE[X]+b,
\qquad
Var(aX+b)=a^2Var(X).
\]

Para \(X\ge0\):

\[
E[X]=\int_0^\infty P(X>t)\,dt.
\]

### Transformações

Se \(Y=g(X)\), no caso discreto:

\[
p_Y(y)=\sum_{x:g(x)=y}p_X(x).
\]

No caso contínuo, se \(g\) é estritamente monótona:

\[
f_Y(y)=f_X(g^{-1}(y))
\left|\frac{d}{dy}g^{-1}(y)\right|.
\]

Com vários ramos \(x_i\) que satisfazem \(g(x_i)=y\):

\[
f_Y(y)=\sum_i\frac{f_X(x_i)}{|g'(x_i)|}.
\]

### Quantis

\[
q_p=F_X^{-1}(p)=\inf\{x:F_X(x)\ge p\}.
\]

A mediana é \(q_{0,5}\); os quartis são \(q_{0,25}\), \(q_{0,5}\) e \(q_{0,75}\).

## 4. Distribuições essenciais

### Discretas

| Distribuição e suporte | PMF | Média | Variância |
|---|---|---:|---:|
| Bernoulli \(X\in\{0,1\}\) | \(p^x(1-p)^{1-x}\) | \(p\) | \(p(1-p)\) |
| Binomial \(k=0,\ldots,n\) | \(\binom nkp^k(1-p)^{n-k}\) | \(np\) | \(np(1-p)\) |
| Geométrica \(k=1,2,\ldots\) | \((1-p)^{k-1}p\) | \(1/p\) | \((1-p)/p^2\) |
| Binomial negativa: ensaio do \(r\)-ésimo sucesso | \(\binom{k-1}{r-1}p^r(1-p)^{k-r}\) | \(r/p\) | \(r(1-p)/p^2\) |
| Poisson \(k=0,1,\ldots\) | \(e^{-\lambda}\lambda^k/k!\) | \(\lambda\) | \(\lambda\) |
| Hipergeométrica | \(\dfrac{\binom Kk\binom{N-K}{n-k}}{\binom Nn}\) | \(nK/N\) | \(n\frac KN(1-\frac KN)\frac{N-n}{N-1}\) |

Critérios: binomial conta sucessos em ensaios independentes com o mesmo \(p\); hipergeométrica amostra sem reposição; geométrica espera o primeiro sucesso; binomial negativa espera o \(r\)-ésimo; Poisson conta eventos com taxa constante. Para uma taxa \(r\) em intervalo \(t\), use \(\lambda=rt\).

Aproximações frequentes:

\[
Bin(n,p)\approx Pois(np)
\quad\text{quando \(n\) é grande e \(p\) é pequeno},
\]

\[
Bin(n,p)\approx N(np,np(1-p))
\quad\text{quando \(np\) e \(n(1-p)\) são suficientemente grandes}.
\]

Na aproximação normal de uma variável inteira, use a correção de continuidade; por exemplo,
\[
P(X\le k)\approx P(Y\le k+0{,}5).
\]

Propriedade sem memória da geométrica:

\[
P(X>m+n\mid X>m)=P(X>n).
\]

### Contínuas

| Distribuição | PDF no suporte | Média | Variância |
|---|---|---:|---:|
| Uniforme \(U(a,b)\) | \(1/(b-a)\) | \((a+b)/2\) | \((b-a)^2/12\) |
| Exponencial \(Exp(\lambda)\) | \(\lambda e^{-\lambda x},\ x\ge0\) | \(1/\lambda\) | \(1/\lambda^2\) |
| Normal \(N(\mu,\sigma^2)\) | \(\dfrac1{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/(2\sigma^2)}\) | \(\mu\) | \(\sigma^2\) |
| Gamma forma–taxa \(Gamma(\alpha,\lambda)\) | \(\dfrac{\lambda^\alpha}{\Gamma(\alpha)}x^{\alpha-1}e^{-\lambda x}\) | \(\alpha/\lambda\) | \(\alpha/\lambda^2\) |
| Beta \(Beta(\alpha,\beta)\), \(0<x<1\) | \(\dfrac{x^{\alpha-1}(1-x)^{\beta-1}}{B(\alpha,\beta)}\) | \(\dfrac\alpha{\alpha+\beta}\) | \(\dfrac{\alpha\beta}{(\alpha+\beta)^2(\alpha+\beta+1)}\) |
| Qui-quadrado \(\chi^2_k\) | \(Gamma(k/2,\text{taxa }1/2)\) | \(k\) | \(2k\) |
| Cauchy padrão | \(1/[\pi(1+x^2)]\) | não existe | não existe |

Funções especiais:

\[
\Gamma(\alpha)=\int_0^\infty x^{\alpha-1}e^{-x}\,dx,
\qquad
B(\alpha,\beta)=\frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha+\beta)}.
\]

Exponencial:

\[
F_X(x)=1-e^{-\lambda x},
\qquad
P(X>x)=e^{-\lambda x},
\]

\[
P(X>s+t\mid X>s)=P(X>t).
\]

Normal e padronização:

\[
Z=\frac{X-\mu}{\sigma}\sim N(0,1),
\]

\[
P(a<X<b)=\Phi\!\left(\frac{b-\mu}{\sigma}\right)
-\Phi\!\left(\frac{a-\mu}{\sigma}\right).
\]

Regra 68–95–99,7%: aproximadamente 68%, 95% e 99,7% da massa normal ficam a 1, 2 e 3 desvios-padrão da média.

Gamma representa, entre outras aplicações, o tempo até o \(\alpha\)-ésimo evento de um processo de Poisson quando \(\alpha\) é inteiro (Erlang). Se \(T_k\) é o tempo até o \(k\)-ésimo evento:

\[
P(T_k\le t)=P(N(t)\ge k).
\]

### Variáveis mistas

Uma variável mista combina massas \(P(X=a_j)=p_j\) e uma parte contínua \(f_c\):

\[
\sum_jp_j+\int f_c(x)\,dx=1,
\]

\[
E[g(X)]=\sum_jg(a_j)p_j+\int g(x)f_c(x)\,dx.
\]

Usando a delta de Dirac, a parte discreta também pode ser escrita dentro de uma “densidade generalizada”:

\[
f_X(x)=\sum_j p_j\,\delta(x-a_j)+f_c(x),
\qquad
\int_{-\infty}^{\infty}g(x)\delta(x-a)\,dx=g(a).
\]

## 5. Distribuições conjuntas

### Funções conjuntas e marginais

\[
F_{X,Y}(x,y)=P(X\le x,Y\le y).
\]

Caso discreto:

\[
p_{X,Y}(x,y)=P(X=x,Y=y),
\quad
p_X(x)=\sum_yp_{X,Y}(x,y).
\]

Caso contínuo:

\[
P((X,Y)\in R)=\iint_Rf_{X,Y}(x,y)\,dxdy,
\quad
f_X(x)=\int_{-\infty}^{\infty}f_{X,Y}(x,y)\,dy.
\]

Condicionais:

\[
p_{Y\mid X}(y\mid x)=\frac{p_{X,Y}(x,y)}{p_X(x)},
\qquad
f_{Y\mid X}(y\mid x)=\frac{f_{X,Y}(x,y)}{f_X(x)}.
\]

Independência:

\[
F_{X,Y}=F_XF_Y,
\qquad
p_{X,Y}=p_Xp_Y
\quad\text{ou}\quad
f_{X,Y}=f_Xf_Y.
\]

### Esperança conjunta e condicional

\[
E[g(X,Y)]=\sum_x\sum_yg(x,y)p_{X,Y}(x,y)
\]

ou a integral dupla correspondente. A esperança é linear sem exigir independência:

\[
E\!\left[\sum_i a_iX_i\right]=\sum_i a_iE[X_i].
\]

Para valores com probabilidade ou densidade marginal positiva:

\[
E[Y\mid X=x]=\sum_y y\,p_{Y\mid X}(y\mid x)
\quad\text{ou}\quad
E[Y\mid X=x]=\int_{-\infty}^{\infty}y\,f_{Y\mid X}(y\mid x)\,dy.
\]

Lei da esperança total:

\[
E[Y]=E[E[Y\mid X]].
\]

Lei da variância total:

\[
Var(Y)=E[Var(Y\mid X)]+Var(E[Y\mid X]).
\]

### Covariância e correlação

\[
Cov(X,Y)=E[XY]-E[X]E[Y],
\]

\[
\rho_{X,Y}=\frac{Cov(X,Y)}{\sigma_X\sigma_Y},
\qquad -1\le\rho\le1.
\]

\[
Var\!\left(\sum_i a_iX_i\right)
=\sum_i a_i^2Var(X_i)+2\sum_{i<j}a_ia_jCov(X_i,X_j).
\]

Independência implica covariância zero quando os momentos existem; o inverso não vale em geral. Para variáveis conjuntamente normais, covariância zero implica independência.

### Normal bivariada

Se \(X\) e \(Y\) são conjuntamente normais, com médias \(\mu_X,\mu_Y\), desvios-padrão \(\sigma_X,\sigma_Y\) e correlação \(\rho\), \(|\rho|<1\), então:

\[
f_{X,Y}(x,y)=
\frac{1}{2\pi\sigma_X\sigma_Y\sqrt{1-\rho^2}}
\exp\!\left\{-\frac{1}{2(1-\rho^2)}
\left[
\frac{(x-\mu_X)^2}{\sigma_X^2}
-\frac{2\rho(x-\mu_X)(y-\mu_Y)}{\sigma_X\sigma_Y}
+\frac{(y-\mu_Y)^2}{\sigma_Y^2}
\right]\right\}.
\]

As marginais são normais. Nesse modelo, \(\rho=0\) equivale à independência entre \(X\) e \(Y\).

### Somas, extremos e transformações bidimensionais

Para \(Z=X+Y\), com \(X,Y\) independentes:

\[
p_Z(z)=\sum_xp_X(x)p_Y(z-x),
\]

\[
f_Z(z)=\int_{-\infty}^{\infty}f_X(x)f_Y(z-x)\,dx.
\]

Fechamentos úteis para variáveis independentes:

\[
Bin(n_1,p)+Bin(n_2,p)\sim Bin(n_1+n_2,p),
\]

\[
Pois(\lambda_1)+Pois(\lambda_2)\sim Pois(\lambda_1+\lambda_2),
\]

\[
N(\mu_1,\sigma_1^2)+N(\mu_2,\sigma_2^2)
\sim N(\mu_1+\mu_2,\sigma_1^2+\sigma_2^2),
\]

\[
Gamma(\alpha_1,\lambda)+Gamma(\alpha_2,\lambda)
\sim Gamma(\alpha_1+\alpha_2,\lambda).
\]

Para variáveis independentes:

\[
F_{\max(X_1,\ldots,X_n)}(t)=\prod_iF_{X_i}(t),
\]

\[
P(\min(X_1,\ldots,X_n)>t)=\prod_i[1-F_{X_i}(t)].
\]

Se \((U,V)=g(X,Y)\) é uma transformação bijetiva diferenciável, com inversa \((x(u,v),y(u,v))\):

\[
f_{U,V}(u,v)=f_{X,Y}(x(u,v),y(u,v))
\left|\frac{\partial(x,y)}{\partial(u,v)}\right|.
\]

## 6. Várias variáveis, MGF e função característica

Para um vetor aleatório \(\mathbf X=(X_1,\ldots,X_n)^T\):

\[
\boldsymbol\mu=E[\mathbf X],
\qquad
\Sigma=E[(\mathbf X-\boldsymbol\mu)(\mathbf X-\boldsymbol\mu)^T].
\]

Se \(\mathbf Y=A\mathbf X+\mathbf b\):

\[
E[\mathbf Y]=A\boldsymbol\mu+\mathbf b,
\qquad
Cov(\mathbf Y)=A\Sigma A^T.
\]

### Função geradora de momentos

\[
M_X(s)=E[e^{sX}].
\]

Se existe em uma vizinhança de zero:

\[
M_X^{(n)}(0)=E[X^n].
\]

Para variáveis independentes:

\[
M_{X_1+\cdots+X_n}(s)=\prod_iM_{X_i}(s).
\]

MGFs úteis:

| Distribuição | \(M_X(s)\) |
|---|---|
| Bernoulli \((p)\) | \(1-p+pe^s\) |
| Binomial \((n,p)\) | \((1-p+pe^s)^n\) |
| Poisson \((\lambda)\) | \(\exp[\lambda(e^s-1)]\) |
| Exponencial de taxa \(\lambda\) | \(\lambda/(\lambda-s),\ s<\lambda\) |
| Gamma forma–taxa \((\alpha,\lambda)\) | \((\lambda/(\lambda-s))^\alpha,\ s<\lambda\) |
| Normal \((\mu,\sigma^2)\) | \(\exp(\mu s+\sigma^2s^2/2)\) |

### Função característica

\[
\varphi_X(t)=E[e^{itX}],
\qquad i^2=-1.
\]

Ela sempre existe, determina a distribuição e, para independentes,

\[
\varphi_{X_1+\cdots+X_n}(t)=\prod_i\varphi_{X_i}(t).
\]

Quando os momentos existem,

\[
E[X^n]=\frac{\varphi_X^{(n)}(0)}{i^n}.
\]

## 7. Limites para probabilidades

### União e Bonferroni

\[
P\!\left(\bigcup_{i=1}^nA_i\right)\le\sum_{i=1}^nP(A_i).
\]

\[
P\!\left(\bigcap_{i=1}^nA_i\right)
\ge1-\sum_{i=1}^nP(A_i^c).
\]

### Markov e Chebyshev

Se \(X\ge0\) e \(a>0\):

\[
P(X\ge a)\le\frac{E[X]}a.
\]

Se \(E[X]=\mu\) e \(Var(X)=\sigma^2<\infty\):

\[
P(|X-\mu|\ge a)\le\frac{\sigma^2}{a^2},
\]

\[
P(|X-\mu|\ge k\sigma)\le\frac1{k^2}.
\]

### Chernoff

Para \(s>0\) e MGF finita:

\[
P(X\ge a)\le e^{-sa}M_X(s),
\]

portanto o melhor limite dessa forma é

\[
P(X\ge a)\le\inf_{s>0}e^{-sa}M_X(s).
\]

### Cauchy–Schwarz e Jensen

\[
|E[XY]|\le\sqrt{E[X^2]E[Y^2]}.
\]

Se \(g\) é convexa:

\[
g(E[X])\le E[g(X)].
\]

Para \(g\) côncava, a desigualdade de Jensen se inverte.

## 8. Leis limite e convergência

### Lei dos Grandes Números

Se \(X_1,X_2,\ldots\) são i.i.d. e \(E[X_i]=\mu\), então:

\[
\bar X_n=\frac1n\sum_{i=1}^nX_i
\xrightarrow{P}\mu.
\]

Equivalentemente, para todo \(\varepsilon>0\):

\[
P(|\bar X_n-\mu|>\varepsilon)\to0.
\]

### Teorema Central do Limite

Se, além disso, \(Var(X_i)=\sigma^2<\infty\):

\[
\frac{\sum_{i=1}^nX_i-n\mu}{\sigma\sqrt n}
\xrightarrow{d}N(0,1).
\]

Para \(n\) grande:

\[
S_n\approx N(n\mu,n\sigma^2),
\qquad
\bar X_n\approx N\!\left(\mu,\frac{\sigma^2}{n}\right).
\]

### Modos de convergência

- **Em distribuição:** \(X_n\xrightarrow{d}X\) se \(F_{X_n}(x)\to F_X(x)\) em todo ponto de continuidade de \(F_X\).
- **Em probabilidade:** \(X_n\xrightarrow{P}X\) se, para todo \(\varepsilon>0\), \(P(|X_n-X|>\varepsilon)\to0\).
- **Em média quadrática:** \(X_n\xrightarrow{L^2}X\) se \(E[(X_n-X)^2]\to0\).
- **Quase certamente:** \(X_n\xrightarrow{q.c.}X\) se \(P(\lim_nX_n=X)=1\).

Implicações principais:

\[
X_n\xrightarrow{q.c.}X
\Longrightarrow
X_n\xrightarrow{P}X
\Longrightarrow
X_n\xrightarrow{d}X,
\]

\[
X_n\xrightarrow{L^2}X
\Longrightarrow
X_n\xrightarrow{P}X.
\]

As recíprocas não valem em geral. Quando o limite é uma constante, convergência em distribuição implica convergência em probabilidade.

## 9. Checklist de aplicação

1. Defina o experimento, o suporte e os eventos antes de calcular.
2. Verifique se os resultados são equiprováveis antes de usar favoráveis/total.
3. Em contagem, determine se a ordem importa e se há reposição.
4. Diferencie eventos disjuntos de eventos independentes.
5. Em condicionamento, identifique o mecanismo que produziu a informação.
6. Em Bayes, inclua as probabilidades a priori e todos os termos da evidência.
7. Escolha a distribuição pelo mecanismo gerador, não pelo formato da fórmula.
8. Declare a parametrização de Exponencial e Gamma: taxa ou escala.
9. Em densidades conjuntas, determine a região de suporte antes dos limites de integração.
10. Não conclua independência apenas a partir de covariância ou correlação zero.
11. Para somas, verifique independência antes de somar variâncias ou multiplicar MGFs.
12. Use uma distribuição exata simples antes de recorrer ao TCL.
13. Confira se o resultado final está entre 0 e 1 e se unidades e suporte fazem sentido.

## Fonte

Resumo dos capítulos de probabilidade 1 a 7 de H. Pishro-Nik, [*Introduction to Probability, Statistics, and Random Processes*](https://www.probabilitycourse.com/). Foram excluídos os capítulos de inferência estatística.
