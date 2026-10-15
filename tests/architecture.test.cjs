const assert = require("node:assert/strict");
const { readdirSync, readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const sourceRoot = path.join(__dirname, "..", "src");
const layerFolders = ["domain", "application", "infrastructure", "presentation"];
const filesByLayer = Object.fromEntries(
  layerFolders.map((layer) => [layer, collectFiles(path.join(sourceRoot, layer))]),
);

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
  });
}

function layerOf(file) {
  const relativePath = path.relative(sourceRoot, file);
  return layerFolders.find((layer) => relativePath.startsWith(`${layer}${path.sep}`));
}

function importedLayers(file) {
  const source = readFileSync(file, "utf8");
  const imports = [
    ...source.matchAll(/\bfrom\s+["']([^"']+)["']|\bimport\s*["']([^"']+)["']/g),
  ];
  return imports.flatMap((match) => {
    const specifier = match[1] ?? match[2];
    if (!specifier.startsWith(".")) {
      return [];
    }
    const importedFile = path.resolve(path.dirname(file), specifier);
    return [layerOf(importedFile)];
  });
}

test("domain does not depend on outer layers", () => {
  for (const file of filesByLayer.domain) {
    assert(
      importedLayers(file).every((layer) => layer === "domain" || layer === undefined),
      `${path.relative(sourceRoot, file)} must not depend on outer layers`,
    );
  }
});

test("application depends only on application and domain", () => {
  for (const file of filesByLayer.application) {
    assert(
      importedLayers(file).every((layer) =>
        ["application", "domain", undefined].includes(layer),
      ),
      `${path.relative(sourceRoot, file)} must not depend on infrastructure or presentation`,
    );
  }
});

test("infrastructure does not depend on presentation", () => {
  for (const file of filesByLayer.infrastructure) {
    assert(
      importedLayers(file).every((layer) => layer !== "presentation"),
      `${path.relative(sourceRoot, file)} must not depend on presentation`,
    );
  }
});

test("presentation does not depend on infrastructure", () => {
  for (const file of filesByLayer.presentation) {
    assert(
      importedLayers(file).every((layer) => layer !== "infrastructure"),
      `${path.relative(sourceRoot, file)} must not depend on infrastructure`,
    );
  }
});
