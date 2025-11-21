import * as fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

const KNOWLEDGE_FILE = path.join(__dirname, "..", "src", "data", "data.json");

const TOTAL_ITEMS = 25;

const responseSchema = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      name: {
        type: "STRING",
        description: "Nome da tecnologia.",
      },
      description: {
        type: "STRING",
        description: "Descrição detalhada e clara.",
      },
      year: {
        type: "NUMBER",
        description: "Ano de criação da tecnologia.",
      },
      link: {
        type: "STRING",
        description: "URL oficial da tecnologia.",
      },
      image: {
        type: "STRING",
        description:
          "Caminho da imagem no formato assets/images/programming-languages/<nome>.svg",
      },
    },
    required: ["name", "description", "year", "link", "image"],
  },
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateNewKnowledge(existingKnowledge) {
  const existingNames = existingKnowledge.map((item) => item.name).join(", ");

  const systemPrompt = `
Você é um especialista em linguagens de programação. 
Sua tarefa é gerar exatamente ${TOTAL_ITEMS} NOVAS LINGUAGENS DE PROGRAMAÇÃO seguindo ESTRITAMENTE o formato:

{
  "name": "Nome da linguagem",
  "description": "Descrição clara e detalhada.",
  "year": 1990,
  "link": "https://site-oficial.com",
  "image": "assets/images/programming-languages/<nome-em-kebab-case>.svg"
}

Regras obrigatórias:
- Apenas linguagens de programação. NÃO inclua frameworks, bibliotecas, APIs, bancos de dados, ferramentas ou sistemas.
- O ARRAY deve conter EXATAMENTE ${TOTAL_ITEMS} itens.
- Todos os nomes devem ser únicos.
- NÃO repita nenhum nome já existente na base atual.
- A propriedade "year" deve ser um número inteiro.
- O campo "image" deve sempre seguir o padrão:
  assets/images/programming-languages/<nome-da-linguagem-minusculo-sem-espaços>.svg
- As linguagens devem ser populares, relevantes e amplamente utilizadas atualmente.
- NÃO use tags, NÃO use campos extras — apenas as 5 chaves:
  name, description, year, link, image.
`;

  const userQuery = `
Gere uma lista com EXATAMENTE ${TOTAL_ITEMS} novas LINGUAGENS DE PROGRAMAÇÃO, sem repetir NENHUM dos nomes já existentes: ${existingNames}.

O resultado deve ser um ARRAY JSON **somente** com objetos contendo:
name, description, year, link, image.

Formato obrigatório para TODOS os itens:
{
  "name": "Nome da linguagem",
  "description": "Descrição detalhada da linguagem de programação.",
  "year": 1990,
  "link": "https://documentacao-oficial.com",
  "image": "assets/images/programming-languages/<nome-da-linguagem-minusculo-sem-espaços>.svg"
}

IMPORTANTE:
- Apenas linguagens de programação. NÃO inclua frameworks, bibliotecas, APIs, bancos de dados ou ferramentas.
- Todas as linguagens devem ser reais, populares e relevantes atualmente.

Apenas responda com o JSON puro, sem explicações.
`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  };

  let response;
  let retries = 0;
  const maxRetries = 5;

  while (retries < maxRetries) {
    try {
      response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (jsonText) {
          try {
            const newKnowledge = JSON.parse(jsonText);

            if (
              Array.isArray(newKnowledge) &&
              newKnowledge.length === TOTAL_ITEMS
            ) {
              console.log(
                `Sucesso! ${TOTAL_ITEMS} novos itens gerados pela API.`
              );
              return newKnowledge;
            } else {
              throw new Error(
                `O array retornado não contém ${TOTAL_ITEMS} itens. Encontrados: ${
                  Array.isArray(newKnowledge) ? newKnowledge.length : 0
                }`
              );
            }
          } catch (parseError) {
            throw new Error(
              "JSON malformado ou incompleto na resposta da API."
            );
          }
        } else {
          throw new Error("Resposta da API vazia ou sem conteúdo textual.");
        }
      } else {
        throw new Error(
          `Falha na API com status ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      retries++;
      if (retries < maxRetries) {
        const waitTime = Math.pow(2, retries) * 1000;
        await delay(waitTime);
      } else {
        throw new Error(
          `Falha ao gerar o conhecimento após várias tentativas: ${error.message}`
        );
      }
    }
  }
}

async function main() {
  if (!apiKey) {
    console.error(
      "\n Erro: A variável de ambiente GEMINI_API_KEY não está definida."
    );
    console.log(
      "Por favor, crie um arquivo '.env' na raiz do projeto e defina a chave:"
    );
    console.log('GEMINI_API_KEY="SUA_CHAVE_AQUI"');
    return;
  }

  try {
    let existingKnowledge = [];
    try {
      const data = await fs.readFile(KNOWLEDGE_FILE, "utf-8");
      existingKnowledge = JSON.parse(data);
      console.log(
        `Base de conhecimento inicial carregada. Total de itens: ${existingKnowledge.length}`
      );
    } catch (e) {
      if (e.code === "ENOENT") {
        console.log(
          `O arquivo ${KNOWLEDGE_FILE} não foi encontrado. Iniciando com uma base vazia.`
        );
      } else {
        throw new Error(`Erro ao ler/analisar ${KNOWLEDGE_FILE}: ${e.message}`);
      }
    }

    console.log("Aumentando sua base de conhecimento!");
    const newKnowledge = await generateNewKnowledge(existingKnowledge);

    const totalKnowledge = [...existingKnowledge, ...newKnowledge];
    console.log(
      `Base de conhecimento combinada. Total final de itens: ${totalKnowledge.length}`
    );

    await fs.writeFile(
      KNOWLEDGE_FILE,
      JSON.stringify(totalKnowledge, null, 2),
      "utf-8"
    );
    console.log(`\n Sucesso!`);
    console.log(
      `O arquivo '${KNOWLEDGE_FILE}' foi atualizado com ${totalKnowledge.length} itens.`
    );
  } catch (error) {
    console.error("\n Erro fatal:", error.message);
    console.log(
      "Verifique se sua chave de API está correta e se há conectividade."
    );
  }
}

main();
