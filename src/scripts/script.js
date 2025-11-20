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
      <h2>${lang.nome}</h2>
      <p><strong>Ano de Criação:</strong> ${lang.ano}</p>
      <p>${lang.descricao}</p>
      <a href="${lang.link}" target="_blank" rel="noopener noreferrer">Ver Documentação</a>
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
    lang.nome.toLowerCase().includes(termoBusca)
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
}

document.addEventListener("DOMContentLoaded", setup);
