<h1 align="center">
  Codex - Linguagens de Programação
</h1>

<div align="center">

![Maintenance](https://img.shields.io/maintenance/yes/2025?style=for-the-badge)
![License MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-completed-brightgreen?style=for-the-badge)

</div>

## 📖 Descrição

Cria e expande automaticamente uma base de conhecimento em JSON adicionando, em cada execução, 25 novas entradas únicas sobre tecnologias (linguagens, frameworks, ferramentas, bancos de dados, metodologias). A lógica usa a API Gemini para gerar conteúdo estruturado e valida/mescla o resultado com o arquivo local `knowledgeBase.json`.

O que ele faz (resumido)

- Gera exatamente 25 novas entradas em formato JSON.
- Evita repetir nomes já presentes na base.
- Faz validação básica da resposta (garante que seja um ARRAY com 25 objetos).
- Realiza tentativas com backoff exponencial em caso de falhas.
- Atualiza (sobrescreve) o arquivo `knowledgeBase.json` com a base combinada.

Pré-requisitos

- Node.js instalado (v16+ recomendado).
- Chave da Gemini API.

Como executar (resumido)

1. Instale dependências:

   ```js
   npm install
   ```

2. Crie um arquivo `.env` na raiz com:
   GEMINI_API_KEY="SUA_CHAVE_AQUI"

3. Execute:
   ```js
   npm start
   ```

O que esperar

- Ao finalizar, o arquivo `knowledgeBase.json` será atualizado com as entradas antigas + 25 novas geradas.
- Logs no console informam sucesso, número de itens e possíveis erros.

Onde ajustar comportamento

- Para alterar a quantidade gerada, edite a constante `TOTAL_ITEMS` em [generator.js](generator.js) (`TOTAL_ITEMS`).
- Função responsável pela geração: [`generateNewKnowledge`](generator.js).
- Fluxo principal: [`main`](generator.js).

Arquivos principais

- [generator.js](generator.js) — script principal que chama a API e atualiza a base.
- [knowledgeBase.json](knowledgeBase.json) — arquivo de dados que será atualizado.
- [package.json](package.json) — configuração do projeto e script de start.
- Crie [.env](.env) na raiz com a variável GEMINI_API_KEY.

Avisos rápidos

- O arquivo `knowledgeBase.json` será sobrescrito ao final do processo.
- Verifique limites e custos da API Gemini antes de executar em escala.

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
