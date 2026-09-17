# Fundos do hero

Todas as cinco páginas abrem com hero animado: imagem de fundo numa camada própria que
deriva devagar (`hero-deriva`), mais uma faixa de luz que atravessa (`hero-luz`). Quem
liga tudo é a classe `.hero-foto`; cada página só declara as variáveis do seu
enquadramento em `css/styles.css`.

| Página | Classe | Fundo |
|---|---|---|
| Início | `.hero-prateleira` | `hero-prateleira.svg`, gôndola desenhada por nós |
| Sobre | `.hero-sobre` | `hero-mercado.webp`, enquadrada pela direita |
| Marcas | `.hero-marcas` | a mesma gôndola, mais aproximada e mais lenta |
| Para Indústrias | `.hero-industria` | `hero-industria.webp`, zoom que corta o mapa-múndi |
| Contato | `.hero-contato` | `textura-secao.webp`, só a trama |

Três armadilhas que já custaram tempo:

1. **`url()` em variável CSS resolve relativo ao arquivo de estilo**, não ao HTML. Por isso
   os caminhos começam com `../`. Declarar a variável no `<style>` da página faz o
   navegador procurar em `css/assets/` e o fundo some sem erro nenhum no console.
2. **A ilustração de indústria tem um mapa-múndi** a partir dos 72% da largura, e a 2D
   atua só no Ceará. O par `--hero-size: 160% auto` com `--hero-origem: 0% 50%` mantém
   esse trecho fora do quadro inclusive no ponto de maior zoom da animação.
3. **Traço escuro sobre fundo escuro desaparece** debaixo do véu de contraste. Os SVGs
   usam tons claros de propósito.

O gerador dos fundos desenhados é `dados/gerar_fundo_hero.py`. Movimento reduzido é
respeitado: `prefers-reduced-motion` congela a deriva e apaga a faixa de luz.
