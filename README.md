<div align="center">

<a href="https://github.com/0nF1REy/codex-programming-languages" target="_blank">
    <img src="./resources/images/docs/logotipo-codex.svg" height="100" alt="Logotipo - codex-programming-languages">
</a>

</br>

![Maintenance](https://img.shields.io/maintenance/yes/2025?style=for-the-badge)
![License MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-completed-brightgreen?style=for-the-badge)

</div>

<p align="center">
Um catálogo web interativo de linguagens de programação com uma base de conhecimento que se expande automaticamente usando a API do Gemini.
</p>
<div align="center">
<img src="./resources/images/docs/home.png" alt="Demonstração do Projeto Codex" width="800"/>
</div>
<p align="center"><sub>Página Inicial</sub></p>

## 📖 Visão Geral

Este repositório reúne dois trabalhos complementares relacionados ao tema "linguagens e ferramentas de programação":

- Um site estático (em `src`) que apresenta um catálogo de linguagens/tecnologias e ativos (imagens, dados e estilos). Chamamos essa parte de **Codex**.
- Uma ferramenta Node.js (`knowledge-generator`) para expandir automaticamente uma base de conhecimento em JSON usando a API Gemini, que gera entradas estruturadas sobre tecnologias.

O objetivo conjunto é fornecer uma vitrine (site) alimentada por uma base de dados que pode ser aumentada automaticamente pelo gerador.

## 📁 Estrutura Principal

- `knowledge-generator/` — Script Node.js com a lógica do Gemini.
- `resources/` — Imagens e assets para a documentação.
- `src/` — Código-fonte do catálogo (HTML, CSS, JS).
- `.env.example` — Exemplo de arquivo de ambiente.
- `package.json` — Dependências e scripts do projeto.
- `README.md` — Esta documentação.

## ✨ Principais Funcionalidades

O projeto é dividido em duas partes principais: uma interface de usuário rica e um gerador de conteúdo inteligente.

### 🖥️ Frontend (Codex)

- Interface Interativa e Responsiva: Desenvolvida com HTML5, CSS3 e JavaScript puro, a interface é totalmente responsiva e se adapta a desktops, tablets e dispositivos móveis.

- Busca Dinâmica: Filtre linguagens em tempo real com um campo de busca inteligente que atualiza a interface de forma fluida.

- Animações com GSAP: A experiência do usuário é aprimorada com animações de alta performance, incluindo um preloader, transições suaves de entrada para os cards e um header que reage ao scroll.

- Fallback de Imagens: Garante que a interface não quebre caso uma imagem de logo não seja encontrada, substituindo-a por um placeholder.

- Foco em Acessibilidade (A11y): Uso de atributos ARIA para melhorar a experiência de usuários que utilizam leitores de tela.

### 🤖 Backend (Knowledge Generator)

- Geração de Conteúdo com IA: Um script em Node.js utiliza a API do Gemini para gerar novas entradas sobre linguagens de programação, seguindo um schema JSON pré-definido.

- Expansão Automatizada: O script verifica as linguagens já existentes no arquivo data.json para evitar duplicatas, garantindo que o catálogo cresça de forma consistente.

- Robusto e Resiliente: Implementa um sistema de tentativas com backoff exponencial para lidar com falhas de rede ou instabilidades da API.

## 🚀 Tecnologias Utilizadas

![alt text](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![alt text](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.dot.js&logoColor=white)
![alt text](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![alt text](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![alt text](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)
![alt text](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![alt text](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

## 🚀 Começando

Para executar este projeto localmente, siga os passos abaixo.

**Pré-requisitos**

- **Node.js** (versão 18 ou superior)
- **Chave da API do Google Gemini**

**1.** Clone o repositório:

```bash
git clone https://github.com/0nF1REy/codex-programming-languages.git
cd codex-programming-languages
```

**2.** Crie um arquivo **.env** na raiz do projeto e adicione sua chave da API:

```bash
GEMINI_API_KEY="SUA_CHAVE_AQUI"
```

**3.** Instale as dependências do gerador:

```bash
npm install
```

## 🛠️ Como Usar

**1. Gerador de Conhecimento (Backend)**

Para gerar novas entradas e adicioná-las ao **src/data/data.json**, execute o seguinte comando:

```bash
npm start
```

- **Observação:** Para alterar a quantidade de itens gerados por execução, edite a constante _TOTAL_ITEMS_ no arquivo _knowledge-generator/generator.js_.

**2. Visualizando o Catálogo (Frontend)**

Para visualizar a interface web, você pode usar um servidor local. A forma mais simples é com o **serve**:

```bash
npx serve src
```

Acesse **http://localhost:3000** (ou a porta indicada no seu terminal) no seu navegador.

---

## 👤 Sobre o Desenvolvedor

<div align="center">

<table>
  <tr>
    <td align="center">
        <br>
        <a href="https://github.com/0nF1REy" target="_blank">
          <img src="./resources/images/docs/alan-ryan.jpg" height="160" alt="Foto de Alan Ryan">
        </a>
        </p>
        <a href="https://github.com/0nF1REy" target="_blank">
          <strong>Alan Ryan</strong>
        </a>
        </p>
        ☕ Peopleware | Tech Enthusiast | Code Slinger ☕
        <br>
        Apaixonado por código limpo, arquitetura escalável e experiências digitais envolventes
        </p>
          Conecte-se comigo:
        </p>
        <a href="https://www.linkedin.com/in/alan-ryan-b115ba228" target="_blank">
          <img src="https://img.shields.io/badge/LinkedIn-Alan_Ryan-0077B5?style=flat&logo=linkedin" alt="LinkedIn">
        </a>
        <a href="https://gitlab.com/alanryan619" target="_blank">
          <img src="https://img.shields.io/badge/GitLab-@0nF1REy-FCA121?style=flat&logo=gitlab" alt="GitLab">
        </a>
        <a href="mailto:alanryan619@gmail.com" target="_blank">
          <img src="https://img.shields.io/badge/Email-alanryan619@gmail.com-D14836?style=flat&logo=gmail" alt="Email">
        </a>
        </p>
    </td>
  </tr>
</table>

</div>

---

## 📜 Licença <a name="licenca"></a>

Este projeto está sob a **licença MIT**. Consulte o arquivo **[LICENSE](LICENSE)** para obter mais detalhes.

> ℹ️ **Aviso de Licença:** © 2025 Alan Ryan da Silva Domingues. Este projeto está licenciado sob os termos da licença MIT. Isso significa que você pode usá-lo, copiá-lo, modificá-lo e distribuí-lo com liberdade, desde que mantenha os avisos de copyright.

⭐ Se este repositório foi útil para você, considere dar uma estrela!
