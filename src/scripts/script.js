let dados = [];

const botaoBusca = document.getElementById("botao-busca");
const inputBusca = document.querySelector("header input");
const cardContainer = document.querySelector(".card-container");
let isIntroAnimated = false;
let lastSearchTerm = null;
let pendingSearchTerm = null;

function ensureSearchLoader() {
  if (document.getElementById("search-loader")) return;
  const loader = document.createElement("div");
  loader.id = "search-loader";
  loader.className = "search-loader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = `<div class="search-spinner" role="status" aria-label="Carregando resultados"></div>`;
  document.body.appendChild(loader);
}

function showSearchLoader() {
  ensureSearchLoader();
  const loader = document.getElementById("search-loader");
  if (loader) loader.setAttribute("aria-hidden", "false");
  const main = document.querySelector("main");
  if (main) main.setAttribute("aria-busy", "true");

  try {
    if (inputBusca) {
      inputBusca.disabled = true;
      inputBusca.setAttribute("aria-disabled", "true");
    }
    if (botaoBusca) {
      botaoBusca.disabled = true;
      botaoBusca.setAttribute("aria-disabled", "true");
    }
  } catch (e) {}

  try {
    const icon =
      botaoBusca && botaoBusca.querySelector && botaoBusca.querySelector("i");
    if (icon) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
      } else {
        icon.classList.remove("icon-spin");
        void icon.offsetWidth;
        icon.classList.add("icon-loading");
      }
    }
  } catch (e) {
    console.warn("Icon spin failed", e);
  }
}

function hideSearchLoader() {
  const loader = document.getElementById("search-loader");
  if (loader) loader.setAttribute("aria-hidden", "true");
  const main = document.querySelector("main");
  if (main) main.removeAttribute("aria-busy");
  try {
    const icon =
      botaoBusca && botaoBusca.querySelector && botaoBusca.querySelector("i");
    if (icon) {
      icon.classList.remove("icon-loading");
      icon.classList.remove("icon-spin");
    }
  } catch (e) {}

  try {
    if (inputBusca) {
      inputBusca.disabled = false;
      inputBusca.removeAttribute("aria-disabled");
    }
    if (botaoBusca) {
      botaoBusca.disabled = false;
      botaoBusca.removeAttribute("aria-disabled");
    }
  } catch (e) {}
}

function setButtonToSearch() {
  if (!botaoBusca) return;
  const icon = botaoBusca.querySelector && botaoBusca.querySelector("i");
  if (icon) {
    icon.classList.remove("icon-loading", "icon-spin");
    icon.className = "fa-solid fa-magnifying-glass";
  }
  botaoBusca.dataset.mode = "search";
  botaoBusca.setAttribute("aria-label", "Buscar");
  botaoBusca.title = "Buscar";
}

function setButtonToClear() {
  if (!botaoBusca) return;
  const icon = botaoBusca.querySelector && botaoBusca.querySelector("i");
  if (icon) {
    icon.classList.remove("icon-loading", "icon-spin");
    icon.className = "fa-solid fa-xmark";
  }
  botaoBusca.dataset.mode = "clear";
  botaoBusca.setAttribute("aria-label", "Limpar busca");
  botaoBusca.title = "Limpar busca";
}

function onBotaoClick(event) {
  if (botaoBusca && botaoBusca.dataset.mode === "clear") {
    if (inputBusca) {
      inputBusca.value = "";
      inputBusca.focus();
    }

    lastSearchTerm = null;
    pendingSearchTerm = null;
    setButtonToSearch();

    try {
      if (botaoBusca) {
        botaoBusca.disabled = true;
        botaoBusca.setAttribute("aria-disabled", "true");
      }
    } catch (e) {}
    return;
  }

  iniciarBusca();
}

function onInputChange() {
  try {
    const val = inputBusca ? inputBusca.value : "";

    if (!val || val.trim() === "") {
      try {
        if (botaoBusca) {
          botaoBusca.disabled = true;
          botaoBusca.setAttribute("aria-disabled", "true");
        }
      } catch (e) {}
      setButtonToSearch();
      return;
    } else {
      try {
        if (botaoBusca) {
          botaoBusca.disabled = false;
          botaoBusca.removeAttribute("aria-disabled");
        }
      } catch (e) {}
    }
    const valLower = val.toLowerCase();
    if (
      lastSearchTerm !== null &&
      valLower === lastSearchTerm &&
      equalByteLength(val, lastSearchTerm)
    ) {
      setButtonToClear();
    } else {
      setButtonToSearch();
    }
  } catch (e) {}
}

function updateButtonAvailability() {
  try {
    const val = inputBusca ? inputBusca.value || "" : "";
    if (!botaoBusca) return;
    if (!val || val.trim() === "") {
      botaoBusca.disabled = true;
      botaoBusca.setAttribute("aria-disabled", "true");
      setButtonToSearch();
    } else {
      botaoBusca.disabled = false;
      botaoBusca.removeAttribute("aria-disabled");
    }
  } catch (e) {}
}

function equalByteLength(a, b) {
  try {
    if (typeof TextEncoder !== "undefined") {
      const ta = new TextEncoder().encode(a || "");
      const tb = new TextEncoder().encode(b || "");
      return ta.length === tb.length;
    }
  } catch (e) {}
  return (a || "").length === (b || "").length;
}

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
    hideSearchLoader();
    postSearchFinalize();
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
      onComplete: () => {
        hideSearchLoader();
        postSearchFinalize();
      },
    });
  } else {
    hideSearchLoader();
    postSearchFinalize();
  }
}

function postSearchFinalize() {
  try {
    const val = inputBusca ? inputBusca.value : "";
    if (
      pendingSearchTerm !== null &&
      val.toLowerCase() === pendingSearchTerm &&
      equalByteLength(val, pendingSearchTerm)
    ) {
      lastSearchTerm = pendingSearchTerm;
      setButtonToClear();
    } else {
      lastSearchTerm = null;
      setButtonToSearch();
    }
  } catch (e) {}
  pendingSearchTerm = null;
  updateButtonAvailability();
}

async function iniciarBusca() {
  const termoBusca = inputBusca ? inputBusca.value.toLowerCase() : "";
  pendingSearchTerm = termoBusca;
  showSearchLoader();

  const linguagens = await buscarLinguagens();
  if (linguagens.length === 0) {
    hideSearchLoader();
    return;
  }
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
  try {
    if (inputBusca) {
      inputBusca.value = "";
      inputBusca.autocomplete = "off";
      inputBusca.removeAttribute && inputBusca.removeAttribute("value");
    }
  } catch (e) {}
  lastSearchTerm = null;
  pendingSearchTerm = null;

  try {
    if (botaoBusca) {
      botaoBusca.disabled = true;
      botaoBusca.setAttribute("aria-disabled", "true");
    }
  } catch (e) {}

  const linguagensIniciais = await buscarLinguagens();
  exibirResultados(linguagensIniciais);

  if (botaoBusca) botaoBusca.addEventListener("click", onBotaoClick);

  if (inputBusca) {
    inputBusca.addEventListener("input", onInputChange);
    inputBusca.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        try {
          const val = inputBusca ? inputBusca.value || "" : "";
          if (val.trim() !== "") {
            iniciarBusca();
          } else {
            event.preventDefault();
          }
        } catch (e) {}
      }
    });
  }

  setupHeaderScrollBehavior();

  if (typeof gsap !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    runIntroAnimation();
  }

  setButtonToSearch();
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

document.addEventListener("DOMContentLoaded", setup);
