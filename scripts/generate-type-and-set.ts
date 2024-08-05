import { Project } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
});
const sourceFiles = project.addSourceFilesAtPaths("src/**/*.ts");

sourceFiles.forEach((sourceFile) => {
  console.log(sourceFile.getFilePath());
});
