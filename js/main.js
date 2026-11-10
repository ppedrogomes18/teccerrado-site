/* =========================================================
   TecCerrado · scripts do site
   ========================================================= */

// Configurações principais: edite aqui e o site inteiro é atualizado.
const CONFIG = {
  // TODO: número do WhatsApp com DDI 55 + DDD 61, só números
  whatsapp: '5561900000000',
  // @ do Instagram (sem o @)
  instagram: 'tec_cerrado',
  // Mensagem usada nos botões que não têm uma mensagem específica
  mensagemPadrao: 'Olá, TecCerrado! Vim pelo site e gostaria de um orçamento.',
};

const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

function linkWhatsApp(mensagem) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem || CONFIG.mensagemPadrao)}`;
}

/* ---------- Links de WhatsApp e Instagram ---------- */
function prepararLinks() {
  document.querySelectorAll('[data-wa]').forEach((link) => {
    link.href = linkWhatsApp(link.dataset.msg);
  });
  document.querySelectorAll('[data-ig]').forEach((link) => {
    link.href = `https://www.instagram.com/${CONFIG.instagram}/`;
  });
  document.querySelectorAll('[data-ig-handle]').forEach((el) => {
    el.textContent = `@${CONFIG.instagram}`;
  });
  document.querySelectorAll('[data-ano]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------- Menu do celular ---------- */
function prepararMenu() {
  const botao = document.querySelector('[data-hamburguer]');
  const menu = document.querySelector('[data-menu]');
  if (!botao || !menu) return;

  const alternar = (abrir) => {
    botao.setAttribute('aria-expanded', String(abrir));
    botao.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('aberto', abrir);
  };

  botao.addEventListener('click', () => {
    alternar(botao.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) alternar(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('aberto')) {
      alternar(false);
      botao.focus();
    }
  });
}

/* ---------- Cabeçalho e barra fixa do WhatsApp ---------- */
function prepararRolagem() {
  const topo = document.querySelector('[data-topo]');
  const hero = document.querySelector('[data-hero]');
  const contato = document.querySelector('[data-contato]');
  const barra = document.querySelector('[data-barra-wa]');
  if (!hero || !barra || !('IntersectionObserver' in window)) return;

  let heroVisivel = true;
  let contatoVisivel = false;
  const atualizar = () => {
    // a barra aparece depois do hero e some quando o CTA final está na tela
    barra.classList.toggle('visivel', !heroVisivel && !contatoVisivel);
    topo.classList.toggle('rolou', !heroVisivel);
  };

  new IntersectionObserver(([entrada]) => {
    heroVisivel = entrada.isIntersecting;
    atualizar();
  }, { rootMargin: '-120px 0px 0px 0px' }).observe(hero);

  if (contato) {
    new IntersectionObserver(([entrada]) => {
      contatoVisivel = entrada.isIntersecting;
      atualizar();
    }, { threshold: 0.25 }).observe(contato);
  }
}

/* ---------- Revelar seções ao rolar ---------- */
function prepararReveal() {
  const itens = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduzMovimento.matches) {
    itens.forEach((el) => el.classList.add('visivel'));
    return;
  }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('visivel');
      obs.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  itens.forEach((el) => {
    // pequeno atraso em cascata para itens lado a lado
    const irmaos = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    const indice = irmaos.indexOf(el);
    if (indice > 0) el.style.transitionDelay = `${Math.min(indice, 5) * 70}ms`;
    obs.observe(el);
  });
}

/* ---------- Comparador antes/depois ---------- */
function prepararComparador() {
  const caixa = document.querySelector('[data-comparar]');
  if (!caixa) return;
  const alca = caixa.querySelector('.comparar__alca');
  let pos = 50;
  let arrastando = false;

  const definir = (valor) => {
    pos = Math.min(100, Math.max(0, valor));
    caixa.style.setProperty('--pos', `${pos}%`);
    alca.setAttribute('aria-valuenow', String(Math.round(pos)));
    alca.setAttribute('aria-valuetext', `Mostrando ${Math.round(pos)}% do antes`);
  };
  const pelaPosicao = (x) => {
    const r = caixa.getBoundingClientRect();
    definir(((x - r.left) / r.width) * 100);
  };

  caixa.addEventListener('pointerdown', (e) => {
    arrastando = true;
    caixa.setPointerCapture(e.pointerId);
    pelaPosicao(e.clientX);
  });
  caixa.addEventListener('pointermove', (e) => {
    if (arrastando) pelaPosicao(e.clientX);
  });
  const soltar = () => { arrastando = false; };
  caixa.addEventListener('pointerup', soltar);
  caixa.addEventListener('pointercancel', soltar);

  alca.addEventListener('keydown', (e) => {
    const passos = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -20, PageUp: 20 };
    if (e.key in passos) definir(pos + passos[e.key]);
    else if (e.key === 'Home') definir(0);
    else if (e.key === 'End') definir(100);
    else return;
    e.preventDefault();
  });
}

/* ---------- Easter egg: caça aos bugs ----------
   Bugs em pixel art passeiam pela tela de vez em quando.
   A camada não recebe cliques (pointer-events: none): o toque é
   detectado pela posição, então nunca bloqueia botões ou links. */
function prepararCacaBugs() {
  const MAX_BUGS = 3;
  const placar = document.querySelector('[data-placar]');
  const placarNum = document.querySelector('[data-placar-num]');
  let camada = null;
  let bugs = [];
  let quadro = 0;
  let timer = 0;
  let ultimo = 0;
  let ativo = false;
  let total = 0;

  try { total = Number(localStorage.getItem('tc-bugs')) || 0; } catch (e) { /* armazenamento indisponível */ }

  const mostrarPlacar = () => {
    if (!placar || total === 0) return;
    placarNum.textContent = total;
    placar.hidden = false;
  };

  const criarBug = () => {
    const el = document.createElement('div');
    el.className = 'bug-andante';
    el.innerHTML = '<svg viewBox="0 0 13 13"><use href="#px-bug"/></svg>';
    camada.appendChild(el);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const daEsquerda = Math.random() < 0.5;
    const bug = {
      el,
      x: daEsquerda ? -20 : w + 20,
      y: h * (0.25 + Math.random() * 0.55),
      angulo: (daEsquerda ? 0 : Math.PI) + (Math.random() - 0.5) * 0.8,
      velocidade: 38 + Math.random() * 34,
      giro: 0,
      vida: 0,
    };
    posicionar(bug);
    bugs.push(bug);
  };

  const posicionar = (bug) => {
    bug.el.style.transform = `translate3d(${bug.x}px, ${bug.y}px, 0) rotate(${bug.angulo + Math.PI / 2}rad)`;
  };

  const removerBug = (bug) => {
    bug.el.remove();
    bugs = bugs.filter((b) => b !== bug);
  };

  const explodir = (x, y) => {
    for (let i = 0; i < 14; i += 1) {
      const p = document.createElement('span');
      p.className = 'pixel';
      camada.appendChild(p);
      const a = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const d = 30 + Math.random() * 40;
      p.animate([
        { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1 },
        { transform: `translate(${x + Math.cos(a) * d}px, ${y + Math.sin(a) * d}px) scale(.4) rotate(90deg)`, opacity: 0 },
      ], { duration: 520 + Math.random() * 200, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => p.remove();
    }
  };

  const loop = (agora) => {
    const dt = Math.min(Math.max(agora - ultimo, 0) / 1000, 0.05);
    ultimo = agora;
    const w = window.innerWidth;
    const h = window.innerHeight;

    bugs.slice().forEach((bug) => {
      // passeio aleatório suave
      bug.giro += (Math.random() - 0.5) * 6 * dt;
      bug.giro *= 0.96;
      bug.angulo += bug.giro * dt * 3;
      // evita sair por cima ou por baixo
      const virarPara = (alvo) => {
        bug.angulo += Math.atan2(Math.sin(alvo - bug.angulo), Math.cos(alvo - bug.angulo)) * 0.03;
      };
      if (bug.y < h * 0.15) virarPara(Math.PI / 2);
      if (bug.y > h * 0.85) virarPara(-Math.PI / 2);

      bug.x += Math.cos(bug.angulo) * bug.velocidade * dt;
      bug.y += Math.sin(bug.angulo) * bug.velocidade * dt;
      bug.vida += dt;
      posicionar(bug);

      const fora = bug.x < -40 || bug.x > w + 40 || bug.y < -40 || bug.y > h + 40;
      if (fora && bug.vida > 3) removerBug(bug);
    });

    quadro = bugs.length ? requestAnimationFrame(loop) : 0;
  };

  const agendar = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (ativo && !document.hidden && bugs.length < MAX_BUGS) {
        criarBug();
        if (!quadro) {
          ultimo = performance.now();
          quadro = requestAnimationFrame(loop);
        }
      }
      agendar();
    }, 7000 + Math.random() * 9000);
  };

  const aoTocar = (e) => {
    const bug = bugs.find((b) => Math.hypot(b.x - e.clientX, b.y - e.clientY) < 30);
    if (!bug) return;
    explodir(bug.x, bug.y);
    removerBug(bug);
    total += 1;
    try { localStorage.setItem('tc-bugs', String(total)); } catch (err) { /* sem armazenamento */ }
    mostrarPlacar();
    placar.classList.remove('pulou');
    void placar.offsetWidth;
    placar.classList.add('pulou');
  };

  const iniciar = () => {
    if (ativo) return;
    ativo = true;
    camada = document.createElement('div');
    camada.className = 'bugs-camada';
    camada.setAttribute('aria-hidden', 'true');
    document.body.appendChild(camada);
    document.addEventListener('pointerdown', aoTocar, { passive: true });
    mostrarPlacar();
    agendar();
  };

  const parar = () => {
    ativo = false;
    clearTimeout(timer);
    cancelAnimationFrame(quadro);
    quadro = 0;
    bugs = [];
    document.removeEventListener('pointerdown', aoTocar);
    if (camada) camada.remove();
    if (placar) placar.hidden = true;
  };

  // respeita "reduzir movimento", inclusive se mudar com a página aberta
  const decidir = () => (reduzMovimento.matches ? parar() : iniciar());
  reduzMovimento.addEventListener?.('change', decidir);

  // começa só depois que a página carregou, para não pesar no carregamento
  const comecar = () => setTimeout(decidir, 2500);
  if (document.readyState === 'complete') comecar();
  else window.addEventListener('load', comecar, { once: true });
}

prepararLinks();
prepararMenu();
prepararRolagem();
prepararReveal();
prepararComparador();
prepararCacaBugs();
