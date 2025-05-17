import fs from "fs";

const homeDir = process.env.HOME || process.env.USERPROFILE;

//TODO: make this work on windows & linux
const workspaceStoragePath = `${homeDir}/Library/Application Support/Cursor/User/workspaceStorage`;

function retrieveProjects() {
  if (!homeDir) {
    throw new Error("Could not determine the user's home directory.");
  }
  const projects = fs.readdirSync(workspaceStoragePath);
  projects.forEach((projectId) => {
    const projectName = retrieveProjectName(projectId);
    if (projectName) {
      copyProjectDb(projectId, projectName);
    }
  });
}

function retrieveProjectName(projectId: string) {
  const projectPath = `${workspaceStoragePath}/${projectId}/workspace.json`;
  try {
    const projectData = fs.readFileSync(projectPath, "utf8");
    const projectDataJson = JSON.parse(projectData);
    const projectFolderName = projectDataJson.folder;
    const projectName = projectFolderName.split("/").pop();
    return projectName;
  } catch (error) {
    console.error(`Error reading project data for ${projectId}:`, error);
    return null;
  }
}

function copyProjectDb(projectId: string, projectName: string) {
  const projectPath = `${workspaceStoragePath}/${projectId}/state.vscdb`;

  console.log(projectPath);
  try {
    const projectDb = fs.readFileSync(projectPath);
    if (projectDb) {
      const dbPath = `./cursor-data/${projectName}.db`;
      fs.writeFileSync(dbPath, projectDb);
      console.log(`Copied ${projectName} to ${dbPath} successfully`);
    } else {
      console.log(`No project db found for ${projectId}`);
    }
  } catch (error) {
    console.error(`Error copying project db for ${projectId}:`, error);
  }
}

retrieveProjects();
