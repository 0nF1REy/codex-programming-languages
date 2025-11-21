let dados = [];

const botaoBusca = document.getElementById("botao-busca");
const inputBusca = document.querySelector("header input");
const cardContainer = document.querySelector(".card-container");

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
}

async function iniciarBusca() {
  const linguagens = await buscarLinguagens();

  if (linguagens.length === 0) {
    return;
  }

  const termoBusca = inputBusca.value.toLowerCase();
  const resultados = linguagens.filter((lang) =>
    lang.name.toLowerCase().includes(termoBusca)
  );
  exibirResultados(resultados);
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

  setupHeaderScrollBehavior();
}

document.addEventListener("DOMContentLoaded", setup);
