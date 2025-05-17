import sqlite3 from "sqlite3";
import fs from "fs";

const projectName = "afk-researcher";
const language = "typescript";
const techStack = ["react", "nextjs", "tailwindcss", "typescript"];
const framework = "nextjs";
const dependencies = ["react-query", "zustand", "supabase"];

const initialPrompt = `You are an expert software engineering tutor. You will be given the student's programming language, tech stack, framework, dependencies, and a list of questions they have asked. 
Your task is to provide clear, actionable advice on what the student should focus on to improve their understanding and skills. Highlight key concepts, best practices, and common pitfalls relevant to their stack. Tailor your guidance to their specific questions and context, helping them prioritize their learning and development.
<language>${language}</language>
<tech_stack>${techStack.join(", ")}</tech_stack>
<framework>${framework}</framework>
<dependencies>${dependencies.join(", ")}</dependencies>
`;

enum CommandType {
  ChatPanel = 4,
}

async function main() {
  const dbLocation = `./cursor-data/${projectName}.db`;
  const db = new sqlite3.Database(dbLocation);
  let outputPrompt = initialPrompt;
  try {
    const data = await retrieveDataFromSqlDb(
      db,
      "SELECT * FROM ItemTable WHERE key = 'aiService.prompts'"
    );
    const jsonData = JSON.parse(data[0].value);
    const filteredData = jsonData.filter(
      (item: any) => item.commandType === CommandType.ChatPanel
    );
    const outputData = filteredData.map((item: any) => {
      return {
        question: item.text,
      };
    });

    const outputJson = JSON.stringify(outputData, null, 2);
    outputPrompt += `<questions>${outputJson}</questions>`;

    fs.writeFileSync(
      `./output-prompts/${projectName}-prompt.txt`,
      outputPrompt
    );
  } catch (err) {
    console.error("Error retrieving data:", err);
  } finally {
    db.close();
  }
}

function retrieveDataFromSqlDb(
  db: sqlite3.Database,
  query: string
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

main();
