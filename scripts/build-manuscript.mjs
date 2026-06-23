import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lettersDir = join(repoRoot, "letters");
const manuscriptPath = join(repoRoot, "lettersfromdad.md");
const checkOnly = process.argv.includes("--check");

const header = `<p align="center">
  <img src="logo_small.png" alt="Letters from Dad logo">
</p>

<br><br><br>

`;

const separator = `

<br><br><br>


---------------------------------------------------------------------------------------------------------------------------------------------------------------


<br><br><br>


`;

function normalizeMarkdown(value) {
  return value.replace(/\r\n/g, "\n").trimEnd() + "\n";
}

function readLetters() {
  if (!existsSync(lettersDir)) {
    throw new Error("Missing letters/ directory.");
  }

  const files = readdirSync(lettersDir)
    .filter((file) => /^letter-\d{2}-.+\.md$/.test(file))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

  if (files.length === 0) {
    throw new Error("No letter files found in letters/.");
  }

  const seen = new Set();

  return files.map((file) => {
    const fileNumber = file.match(/^letter-(\d{2})-/)?.[1];
    const content = normalizeMarkdown(readFileSync(join(lettersDir, file), "utf8"));
    const markers = [...content.matchAll(/^LETTER\s+(\d{2})$/gm)];

    if (markers.length !== 1) {
      throw new Error(`${file} must contain exactly one LETTER NN marker.`);
    }

    const markerNumber = markers[0][1];

    if (markerNumber !== fileNumber) {
      throw new Error(`${file} uses marker LETTER ${markerNumber}, expected LETTER ${fileNumber}.`);
    }

    if (seen.has(markerNumber)) {
      throw new Error(`Duplicate letter number: ${markerNumber}.`);
    }

    seen.add(markerNumber);

    return {
      file,
      number: markerNumber,
      content,
    };
  });
}

function buildManuscript() {
  const letters = readLetters();
  const body = letters.map((letter) => letter.content.trimEnd()).join(separator);
  return `${header}${body}\n`;
}

const manuscript = buildManuscript();

if (checkOnly) {
  if (!existsSync(manuscriptPath)) {
    throw new Error(`${basename(manuscriptPath)} does not exist. Run npm run build.`);
  }

  const current = normalizeMarkdown(readFileSync(manuscriptPath, "utf8"));

  if (current !== manuscript) {
    throw new Error(`${basename(manuscriptPath)} is out of date. Run npm run build.`);
  }

  console.log(`${basename(manuscriptPath)} is up to date.`);
} else {
  writeFileSync(manuscriptPath, manuscript, "utf8");
  console.log(`Wrote ${basename(manuscriptPath)} from ${readLetters().length} letters.`);
}
