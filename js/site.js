/* 2D Representações — camada de movimento.
 *
 * Tudo aqui e opcional por desenho: sem este arquivo a pagina continua inteira
 * e legivel, com os estados finais visiveis. E o que mantem o argumento
 * comercial de pe se o script falhar, e o que faz os testes de conteudo
 * valerem sem depender de animacao.
 *
 * Sem biblioteca: IntersectionObserver e requestAnimationFrame resolvem, e
 * GSAP/Lenis custariam 40 a 100 KB para fazer o mesmo.
 */
(function () {
  'use strict';

  var paradinho = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- o(s) contador(es) do hero: 0 -> alvo ---------------------------
   * #cnt e .cnt: id e unico por documento, e #cnt/#instr ja estao na home
   * (index.html) — uma segunda ocorrencia na mesma familia de paginas (ex.:
   * industrias.html) usa classe. querySelectorAll aceita as duas formas e
   * cada elemento anima a partir do seu proprio data-alvo, entao mais de um
   * bloco de prova na mesma pagina funciona sem colisao. */
  function contador() {
    var els = document.querySelectorAll('#cnt, .cnt');
    if (!els.length) { return; }
    Array.prototype.forEach.call(els, function (el) {
      var alvo = parseInt(el.getAttribute('data-alvo') || '8', 10);
      if (paradinho) { el.textContent = alvo; return; }

      var dur = 1150, t0 = null;
      function passo(t) {
        if (t0 === null) { t0 = t; }
        var p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * alvo);
        if (p < 1) { requestAnimationFrame(passo); }
      }
      window.setTimeout(function () { requestAnimationFrame(passo); }, 420);
    });
  }

  /* --- revelar na rolagem --------------------------------------------- */
  function revelar() {
    var alvos = document.querySelectorAll('.rv, #instr, .instr, #mapa, #gondola');
    if (!alvos.length) { return; }

    // Sem IntersectionObserver (navegador antigo), mostra tudo de uma vez:
    // melhor a pagina inteira sem animacao do que blocos invisiveis.
    if (paradinho || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(alvos, function (n) { n.classList.add('on'); });
      return;
    }

    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('on');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(alvos, function (n) { io.observe(n); });
  }

  function iniciar() { contador(); revelar(); }

  /* --- rede de seguranca: exceção em tempo de execução --------------------
   * A marca "js-ok" (posta inline no <head>, antes do CSS) e o que autoriza
   * o CSS a esconder .rv/.rulebar/.mapa .m.a/.gondola .prod a espera do
   * ".on" que revelar() acrescenta. O onerror do <script src="js/site.js">
   * cobre falha de REDE (404, proxy, ad-blocker — o arquivo nunca chega).
   * Isso aqui cobre o outro caminho: o arquivo chega e comeca a rodar, mas
   * estoura antes de revelar() marcar os alvos com ".on" — por exemplo um
   * querySelector sem guarda que uma pagina futura (Task 6) introduza. Sem
   * essa rede, a home inteira abaixo da dobra ficaria presa em opacity:0
   * para sempre, e nenhum teste de conteudo pegaria isso. Falhar aberto,
   * nunca fechado. */
  function iniciarSeguro() {
    try {
      iniciar();
    } catch (e) {
      document.documentElement.classList.remove('js-ok');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarSeguro);
  } else {
    iniciarSeguro();
  }
}());
