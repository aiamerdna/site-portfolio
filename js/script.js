const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  menuBtn.setAttribute("aria-expanded", aberto);
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("aberto");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});
const temaBtn = document.getElementById("tema-btn");
const raiz = document.documentElement;

function lerTema() {
  try { return localStorage.getItem("tema"); } catch (e) { return null; }
}
function salvarTema(valor) {
  try { localStorage.setItem("tema", valor); } catch (e) {}
}

function aplicarTema(escuro) {
  raiz.classList.toggle("escuro", escuro);
  temaBtn.textContent = escuro ? "☀️" : "🌙";
}

const salvo = lerTema();
if (salvo) {
  aplicarTema(salvo === "escuro");
} else {
  aplicarTema(window.matchMedia("(prefers-color-scheme: dark)").matches);
}

temaBtn.addEventListener("click", () => {
  const escuro = !raiz.classList.contains("escuro");
  aplicarTema(escuro);
  salvarTema(escuro ? "escuro" : "claro");
});

const header = document.querySelector(".header");
function marcarScroll() {
  header.classList.toggle("rolou", window.scrollY > 10);
}
window.addEventListener("scroll", marcarScroll, { passive: true });
marcarScroll();

const links = document.querySelectorAll(".nav a");
const secoes = document.querySelectorAll("main section[id]");

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      links.forEach((link) => {
        link.classList.toggle("ativo", link.getAttribute("href") === "#" + entrada.target.id);
      });
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });

secoes.forEach((secao) => observador.observe(secao));

document.getElementById("ano").textContent = new Date().getFullYear();

(function () {
  const barra = document.getElementById("progresso");
  if (!barra) return;
  function atualizar() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const parte = total > 0 ? window.scrollY / total : 0;
    barra.style.transform = "scaleX(" + parte + ")";
  }
  window.addEventListener("scroll", atualizar, { passive: true });
  atualizar();
})();

(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const alvos = document.querySelectorAll(
    ".section-title, .sobre-texto, .sobre-figura, .skill, .idioma, .extras, .project, .contact-panel"
  );

  const observadorRevelar = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observadorRevelar.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  alvos.forEach((el) => {
    el.classList.add("revelar");
    observadorRevelar.observe(el);
  });
})();

(function () {
  const botao = document.getElementById("copiar-email");
  const toast = document.getElementById("toast");
  if (!botao) return;

  let timerToast, timerBotao;
  const textoOriginal = botao.textContent;

  function mostrarAviso(mensagem) {
    if (!toast) return;
    toast.textContent = mensagem;
    toast.classList.add("mostrar");
    clearTimeout(timerToast);
    timerToast = setTimeout(() => toast.classList.remove("mostrar"), 2500);
  }

  function marcarCopiado() {
    botao.textContent = "Copiado! ✓";
    botao.classList.add("copiado");
    clearTimeout(timerBotao);
    timerBotao = setTimeout(() => {
      botao.textContent = textoOriginal;
      botao.classList.remove("copiado");
    }, 2000);
    mostrarAviso("E-mail copiado!");
  }

  function copiarAntigo(texto) {
    const campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.opacity = "0";
    document.body.appendChild(campo);
    campo.select();
    let deuCerto = false;
    try { deuCerto = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(campo);
    return deuCerto;
  }

  botao.addEventListener("click", async () => {
    const email = botao.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      marcarCopiado();
    } catch (e) {
      if (copiarAntigo(email)) {
        marcarCopiado();
      } else {
        mostrarAviso("Não consegui copiar. Meu e-mail: " + email);
      }
    }
  });
})();

(function () {
  const botao = document.getElementById("enviar-email");
  if (!botao) return;

  if (window.matchMedia("(pointer: coarse)").matches) {
    botao.href = "mailto:andre.tsmaia23@gmail.com?subject=Contato%20pelo%20portf%C3%B3lio";
    botao.removeAttribute("target");
  }
})();

(function () {
  const botao = document.getElementById("voltar-topo");
  if (!botao) return;

  function atualizar() {
    botao.classList.toggle("mostrar", window.scrollY > 400);
  }
  window.addEventListener("scroll", atualizar, { passive: true });
  atualizar();

  botao.addEventListener("click", () => {
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduzir ? "auto" : "smooth" });
  });
})();

(function () {
  const decos = document.querySelectorAll(".deco");
  if (!decos.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let esperando = false;

  function atualizar() {
    decos.forEach((deco) => {
      const caixa = deco.parentElement.getBoundingClientRect();
      if (caixa.bottom < -200 || caixa.top > window.innerHeight + 200) return;
      const centro = caixa.top + caixa.height / 2 - window.innerHeight / 2;
      const deslocamento = Math.max(-60, Math.min(60, centro * -0.06));
      deco.style.setProperty("--py", deslocamento + "px");
    });
    esperando = false;
  }

  window.addEventListener("scroll", () => {
    if (!esperando) {
      esperando = true;
      requestAnimationFrame(atualizar);
    }
  }, { passive: true });
  window.addEventListener("resize", atualizar);
  atualizar();
})();