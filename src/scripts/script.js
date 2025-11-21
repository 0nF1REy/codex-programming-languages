let dados = [];

const botaoBusca = document.getElementById("botao-busca");
const inputBusca = document.querySelector("header input");
const cardContainer = document.querySelector(".card-container");
let isIntroAnimated = false;

async function buscarLinguagens() {
  if (dados.length > 0) {
    return dados;
  }
  try {
    const resposta = await fetch("./data/data.json");
    if (!resposta.ok) {
      throw new Error(`Erro ao buscar o arquivo: ${resposta.statusText}`);
    }
    dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Falha ao carregar os dados das linguagens:", erro);
    return [];
  }
}

function exibirResultados(resultados) {
  cardContainer.innerHTML = "";

  if (resultados.length === 0) {
    cardContainer.innerHTML = `<p class="sem-resultados">Nenhuma linguagem encontrada.</p>`;
    return;
  }

  resultados.forEach((lang) => {
    const article = document.createElement("article");

    if (lang.image) {
      const img = document.createElement("img");
      img.className = "lang-logo";
      img.alt = `Logo ${lang.name}`;
      img.src = lang.image;
      img.addEventListener("error", () => {
        if (!img.dataset.fallbackUsed) {
          img.dataset.fallbackUsed = "1";
          img.src = "assets/images/placeholder.svg";
          img.alt = "";
          img.setAttribute("aria-hidden", "true");
        } else {
          img.hidden = true;
          img.setAttribute("aria-hidden", "true");
        }
      });
      article.appendChild(img);
    }

    const content = document.createElement("div");
    content.className = "card-content";

    const h2 = document.createElement("h2");
    h2.textContent = lang.name;

    const pYear = document.createElement("p");
    pYear.innerHTML = `<strong>Ano de Criação:</strong> ${lang.year}`;

    const pDesc = document.createElement("p");
    pDesc.textContent = lang.description;

    const a = document.createElement("a");
    a.href = lang.link;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "Ver Documentação";

    content.appendChild(h2);
    content.appendChild(pYear);
    content.appendChild(pDesc);
    content.appendChild(a);
    article.appendChild(content);
    cardContainer.appendChild(article);
  });

  if (isIntroAnimated) {
    gsap.from(".card-container article", {
      autoAlpha: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.5,
      ease: "power3.out",
    });
  }
}

async function iniciarBusca() {
  const linguagens = await buscarLinguagens();
  if (linguagens.length === 0) return;

  const termoBusca = inputBusca.value.toLowerCase();
  const resultados = linguagens.filter((lang) =>
    lang.name.toLowerCase().includes(termoBusca)
  );

  gsap.to(".card-container article", {
    autoAlpha: 0,
    y: 20,
    stagger: 0.05,
    duration: 0.4,
    ease: "power3.in",
    onComplete: () => {
      exibirResultados(resultados);
    },
  });
}

async function setup() {
  const linguagensIniciais = await buscarLinguagens();
  exibirResultados(linguagensIniciais);

  botaoBusca.addEventListener("click", iniciarBusca);
  inputBusca.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      iniciarBusca();
    }
  });

  setupHeaderScrollBehavior();

  if (typeof gsap !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    runIntroAnimation();
    setupFooterAnimation();
  }
}

function setupHeaderScrollBehavior() {
  const header = document.querySelector("header");
  if (!header) return;
  const threshold = 122;

  const onScroll = () => {
    if (window.scrollY > threshold) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  };

  const mq = window.matchMedia("(min-width: 769px)");
  let attached = false;

  const attach = () => {
    if (!attached) {
      window.addEventListener("scroll", onScroll, { passive: true });
      attached = true;
    }
    onScroll();
  };

  const detach = () => {
    if (attached) {
      window.removeEventListener("scroll", onScroll);
      attached = false;
    }
    header.classList.remove("header--scrolled");
  };

  if (mq.matches) attach();
  else detach();

  const mqChangeHandler = (e) => {
    if (e.matches) attach();
    else detach();
  };

  let mqListenerType = null;

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", mqChangeHandler);
    mqListenerType = "event";
  } else if ("onchange" in mq) {
    mq.onchange = mqChangeHandler;
    mqListenerType = "onchange";
  }

  window.addEventListener("beforeunload", () => {
    if (attached) window.removeEventListener("scroll", onScroll);
    if (
      mqListenerType === "event" &&
      typeof mq.removeEventListener === "function"
    ) {
      mq.removeEventListener("change", mqChangeHandler);
    } else if (mqListenerType === "onchange") {
      mq.onchange = null;
    }
  });
}

function runIntroAnimation() {
  const pre = document.getElementById("preloader");
  if (!pre || typeof gsap === "undefined") return;
  const tl = gsap.timeline({
    onComplete: () => {
      isIntroAnimated = true;
    },
  });
  tl.set(document.body, { overflow: "hidden" });
  tl.from(".preloader-inner", {
    autoAlpha: 0,
    y: 24,
    duration: 0.6,
    ease: "power2.out",
  });
  tl.to(
    ".preloader-logo",
    { scale: 1.06, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: 1 },
    "-=.2"
  );
  tl.to(
    ".preloader-bar span",
    { width: "100%", duration: 0.8, ease: "power2.out" },
    "-=.4"
  );
  tl.to(
    "#preloader",
    {
      autoAlpha: 0,
      pointerEvents: "none",
      duration: 0.6,
      onComplete: () => {
        pre.style.display = "none";
        gsap.set(document.body, { overflow: "" });
      },
    },
    "+=0.15"
  );
  tl.from(
    "header",
    { y: -18, autoAlpha: 0, duration: 0.6, ease: "power2.out" },
    "<"
  );
  tl.from(
    ".card-container article",
    { y: 14, autoAlpha: 0, stagger: 0.06, duration: 0.45, ease: "power2.out" },
    "-=.35"
  );
}

function setupFooterAnimation() {
  gsap.from(".footer-inner > *", {
    scrollTrigger: {
      trigger: ".footer",
      start: "top 90%",
      toggleActions: "play none none resume",
    },
    autoAlpha: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
  });
}

document.addEventListener("DOMContentLoaded", setup);
