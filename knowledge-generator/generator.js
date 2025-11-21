import * as fs from "fs/promises";

const apiKey = process.env.GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
const KNOWLEDGE_FILE = "knowledgeBase.json";

const TOTAL_ITEMS = 25;

const responseSchema = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      nome: {
        type: "STRING",
        description: "Nome da tecnologia (ex: React, MongoDB).",
      },
      descricao: {
        type: "STRING",
        description: "Descrição concisa da tecnologia.",
      },
      data_criacao: {
        type: "STRING",
        description: "Ano de criação/lançamento (ex: '2013').",
      },
      link: {
        type: "STRING",
        description: "URL oficial ou de documentação principal.",
      },
      tags: {
        type: "ARRAY",
        description:
          "Array de 3 a 5 strings que categorizam a tecnologia (ex: 'frontend', 'banco de dados', 'framework', 'linguagem de programação').",
        items: { type: "STRING" },
      },
    },
    required: ["nome", "descricao", "data_criacao", "link", "tags"],
  },
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateNewKnowledge(existingKnowledge) {
  const existingNames = existingKnowledge.map((item) => item.nome).join(", ");

  const systemPrompt = `Você é um especialista em tecnologia e linguagens de programação. Sua tarefa é criar ${TOTAL_ITEMS} novas entradas sobre diferentes tecnologias (linguagens, frameworks, ferramentas, bancos de dados, metodologias, etc.) com a mesma estrutura JSON. Garanta que cada entrada seja única e relevante. O foco é em termos atuais e amplamente usados em desenvolvimento de software.`;

  const userQuery = `Gere uma lista de ${TOTAL_ITEMS} novas tecnologias. Siga estritamente a estrutura JSON e o requisito de ser um ARRAY com EXATAMENTE ${TOTAL_ITEMS} objetos. Não inclua as 5 tecnologias iniciais (Python, JavaScript, Java, C++, Ruby) e NÃO use NENHUM DOS seguintes nomes: ${existingNames}.`;

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
