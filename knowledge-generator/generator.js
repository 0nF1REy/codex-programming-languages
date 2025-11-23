import * as fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

async function findProjectRoot(startDir) {
  let currentDir = startDir;
  while (true) {
    try {
      await fs.access(path.join(currentDir, "package.json"));
      return currentDir;
    } catch (e) {
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        throw new Error(
          "Não foi possível encontrar a raiz do projeto (package.json não encontrado)."
        );
      }
      currentDir = parentDir;
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = await findProjectRoot(__dirname);
const KNOWLEDGE_FILE = path.join(projectRoot, "src", "data", "data.json");

const apiKey = process.env.GEMINI_API_KEY;

const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

const TOTAL_ITEMS = 25;

const responseSchema = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      name: { type: "STRING", description: "Nome da tecnologia." },
      description: {
        type: "STRING",
        description: "Descrição detalhada e clara.",
      },
      year: { type: "NUMBER", description: "Ano de criação da tecnologia." },
      link: { type: "STRING", description: "URL oficial da tecnologia." },
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
Você é um especialista em linguagens de programação para desenvolvimento de software.
Sua tarefa é gerar uma lista de EXATAMENTE ${TOTAL_ITEMS} NOVAS LINGUAGENS DE PROGRAMAÇÃO, seguindo estritamente o formato JSON especificado.

Regras obrigatórias:
1.  **FOCO:** Apenas linguagens de programação de propósito geral ou de domínio específico para software.
2.  **EXCLUSÕES:** NÃO inclua frameworks, bibliotecas, APIs, bancos de dados, ferramentas, sistemas operacionais, linguagens de script de shell (como Bash, PowerShell) ou linguagens de descrição de hardware (como VHDL, Verilog).
3.  **QUANTIDADE:** O array JSON de resposta deve conter EXATAMENTE ${TOTAL_ITEMS} itens.
4.  **UNICIDADE:** Todos os nomes de linguagens devem ser únicos e não podem estar na lista de nomes já existentes.
5.  **FORMATO DO CAMPO 'image'**: Deve sempre seguir o padrão: assets/images/programming-languages/<nome-da-linguagem-em-kebab-case>.svg
6.  **RELEVÂNCIA:** As linguagens devem ser reais, populares e relevantes para o desenvolvimento de software moderno.
7.  **ESTRUTURA:** A resposta deve ser apenas o array JSON, sem nenhum texto ou explicação adicional.
`;

  const userQuery = `
Gere uma lista com EXATAMENTE ${TOTAL_ITEMS} novas LINGUAGENS DE PROGRAMAÇÃO para desenvolvimento de software, sem repetir NENHUM dos nomes já existentes: ${existingNames}.

O resultado deve ser um ARRAY JSON **puro**, sem nenhum texto adicional. Cada objeto no array deve conter apenas as seguintes chaves: name, description, year, link, image.

Exemplo de formato para cada item:
{
  "name": "Nome da Linguagem",
  "description": "Uma descrição clara e detalhada da linguagem e seus principais casos de uso.",
  "year": 1995,
  "link": "https://site-oficial.com",
  "image": "assets/images/programming-languages/nome-da-linguagem.svg"
}

IMPORTANTE: Lembre-se de excluir explicitamente linguagens de script de shell e de descrição de hardware.
`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  };

  let retries = 0;
  const maxRetries = 5;

  while (retries < maxRetries) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonText) {
          throw new Error("Resposta da API vazia ou sem conteúdo textual.");
        }

        const newKnowledge = JSON.parse(jsonText);

        if (
          Array.isArray(newKnowledge) &&
          newKnowledge.length === TOTAL_ITEMS
        ) {
          console.log(`Sucesso! ${TOTAL_ITEMS} novos itens gerados pela API.`);
          return newKnowledge;
        } else {
          throw new Error(
            `O array retornado não contém ${TOTAL_ITEMS} itens. Encontrados: ${
              Array.isArray(newKnowledge)
                ? newKnowledge.length
                : "não é um array"
            }`
          );
        }
      } else {
        throw new Error(
          `Falha na API com status ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      retries++;
      console.warn(`Tentativa ${retries} falhou: ${error.message}`);
      if (retries < maxRetries) {
        const waitTime = Math.pow(2, retries) * 1000;
        console.log(`Aguardando ${waitTime / 1000}s para tentar novamente...`);
        await delay(waitTime);
      } else {
        throw new Error(
          `Falha ao gerar o conhecimento após ${maxRetries} tentativas.`
        );
      }
    }
  }
}

async function main() {
  if (!apiKey) {
    console.error(
      "\n[ERRO] A variável de ambiente GEMINI_API_KEY não está definida."
    );
    console.log(
      "Por favor, crie um arquivo '.env' na raiz do projeto e defina a chave:"
    );
    console.log('GEMINI_API_KEY="SUA_CHAVE_AQUI"');
    return;
  }

  try {
    console.log(`Caminho do arquivo de dados sendo usado: ${KNOWLEDGE_FILE}`);
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
          `Arquivo de dados não encontrado. Iniciando com uma base vazia.`
        );
      } else {
        throw new Error(`Erro ao ler/analisar ${KNOWLEDGE_FILE}: ${e.message}`);
      }
    }

    console.log("\nIniciando geração de novos itens...");
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
    console.log(
      `\n Sucesso! O arquivo foi atualizado com ${totalKnowledge.length} itens.`
    );
  } catch (error) {
    console.error("\n Erro fatal no processo:", error.message);
    console.log(
      "Verifique se sua chave de API está correta e se há conectividade com a internet."
    );
  }
}

main();
