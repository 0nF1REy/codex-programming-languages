<h1 align="center">
  Codex - Linguagens de Programação
</h1>

<div align="center">

![Maintenance](https://img.shields.io/maintenance/yes/2025?style=for-the-badge)
![License MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-completed-brightgreen?style=for-the-badge)

</div>

## 📖 Visão geral do repositório

Este repositório reúne dois trabalhos complementares relacionados ao tema "linguagens e ferramentas de programação":

- Um site estático (em `src`) que apresenta um catálogo de linguagens/tecnologias e ativos (imagens, dados e estilos). Chamamos essa parte de **Codex**.
- Uma ferramenta Node.js (`knowledge-generator`) para expandir automaticamente uma base de conhecimento em JSON usando a API Gemini, que gera entradas estruturadas sobre tecnologias.

O objetivo conjunto é fornecer uma vitrine (site) alimentada por uma base de dados que pode ser aumentada automaticamente pelo gerador.

## 📁 Estrutura principal

- `src/` — Código do site estático (HTML, CSS, JS), ativos e dados usados na interface.
- `knowledge-generator/` — Script Node.js que gera novas entradas e mescla com a base local.
- `package.json` / `package-lock.json` — Metadados do projeto e dependências.
- `README.md` — Esta documentação.
- `LICENSE` — Arquivo de licença (MIT).

## Conteúdo do site (Codex)

O diretório `src` contém um site leve que consome `data/data.json` e exibe informações sobre linguagens e tecnologias com imagens e estilos responsivos. Use-o para visualizar o catálogo localmente ou publicar em um host estático.

Como executar localmente (opções rápidas):

1. Abrir diretamente: abra `src/index.html` no seu navegador (funciona para testes simples).

2. Servir via servidor estático (recomendado para testes JS/CORS):

```bash
npx serve src
# ou
npx http-server src
```

Esses comandos servem o conteúdo em `http://localhost:PORT` e refletem corretamente rotas e carga de assets.

## Gerador de conhecimento

O gerador é um script Node.js que consulta a API Gemini para produzir novas entradas de conhecimento e mesclá-las em um arquivo JSON local. É pensado para manutenção da base de dados que alimenta o site.

Principais pontos:

- Gera um lote de entradas por execução (configurável no script).
- Evita duplicatas com a base existente.
- Faz validação básica do formato retornado pela API.
- Usa tentativas com backoff exponencial em falhas de rede/resposta.

Pré-requisitos e execução:

- Node.js (recomendado v16+)
- Crie um arquivo `.env` na raiz com a chave da API:

```bash
GEMINI_API_KEY="SUA_CHAVE_AQUI"
```

Instalação e execução do gerador:

```bash
npm install
npm start
```

Observações de segurança e custo:

- Verifique limites, custos e políticas da API antes de executar em escala.
- O script pode sobrescrever o arquivo de base local — faça backup se necessário.

## Atualizações e manutenção

- Para ajustar a quantidade de entradas geradas, edite a constante `TOTAL_ITEMS` em `knowledge-generator/generator.js`.
- Se mudar caminhos de imagens ou ativos, sincronize `src/data/data.json` com o gerador para evitar referências quebradas.

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
