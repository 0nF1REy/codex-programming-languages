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
    article.innerHTML = `
      <img src="${lang.image}" alt="Logo ${lang.name}" class="lang-logo">
      <div class="card-content">
        <h2>${lang.name}</h2>
        <p><strong>Ano de Criação:</strong> ${lang.year}</p>
        <p>${lang.description}</p>
        <a href="${lang.link}" target="_blank" rel="noopener noreferrer">Ver Documentação</a>
      </div>
    `;
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
