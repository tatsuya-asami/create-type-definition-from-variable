import { exec } from "child_process";
import {
  OptionalKind,
  Project,
  SourceFile,
  TypeAliasDeclarationStructure,
  VariableDeclaration,
} from "ts-morph";

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
});
const sourceFiles = project.addSourceFilesAtPaths("src/**/*.ts");

const getTargetVariable = (sourceFile: SourceFile) => {
  return sourceFile.getVariableDeclarations()?.[0];
};

const createType = (
  targetVariable: VariableDeclaration,
  isTypeArray: boolean
) => {
  const elementType = isTypeArray
    ? targetVariable.getType().getArrayElementType()
    : targetVariable.getType();
  if (!elementType) {
    console.log("No element type found");
    return;
  }

  const typeAlias: OptionalKind<TypeAliasDeclarationStructure> = {
    name: `${targetVariable.getName()[0].toUpperCase()}${targetVariable
      .getName()
      .slice(1, -1)}`, // Start with uppercase and remove the last character
    type: elementType.getText(),
    isExported: true,
  };

  return typeAlias;
};

sourceFiles.forEach((sourceFile) => {
  const targetVariable = getTargetVariable(sourceFile);
  const isTypeArray = targetVariable.getType().isArray();
  const typeAlias = createType(targetVariable, isTypeArray);

  if (!typeAlias) {
    console.error("Type alias not created");
    return;
  }

  sourceFile.insertTypeAlias(0, typeAlias);
  targetVariable.setType(isTypeArray ? `${typeAlias.name}[]` : typeAlias.name);

  sourceFile.saveSync();
});

project.saveSync();
exec(`npx prettier --write src/**/*.ts`);
