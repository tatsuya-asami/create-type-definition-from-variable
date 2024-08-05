import {
  OptionalKind,
  Project,
  SourceFile,
  TypeAliasDeclarationStructure,
} from "ts-morph";

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
});
const sourceFiles = project.addSourceFilesAtPaths("src/**/*.ts");

const createTypeAndSet = (sourceFile: SourceFile) => {
  const targetVariable = sourceFile.getVariableDeclarations()?.[0];
  if (!targetVariable) {
    console.log("No target variables found");
    return;
  }
  const isTypeArray = targetVariable.getType().isArray();
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
      .slice(1)}`,
    type: elementType.getText(),
  };

  sourceFile.insertTypeAlias(0, typeAlias);
  targetVariable.setType(isTypeArray ? `${typeAlias.name}[]` : typeAlias.name);
};

sourceFiles.forEach((sourceFile) => {
  createTypeAndSet(sourceFile);
  sourceFile.saveSync();
});

project.saveSync();
