import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { format, resolveConfig } from "prettier";

type GeneratedBlackCard = {
  id: string;
  text: string;
  pick: number;
};

type GeneratedWhiteCard = {
  id: string;
  text: string;
};

type SourceCard = {
  sourcePath: string;
  text: string;
};

const blackDirectory = resolve("data/black");
const whiteDirectory = resolve("data/white");
const outputPath = resolve("src/cards/deck.generated.ts");
const deckName = "Cards Against Developers";
const blankPattern = /\\BLANK|_{3,}/g;

function compareEntries(a: string, b: string): number {
  const partsA = a.match(/\d+|\D+/g) ?? [];
  const partsB = b.match(/\d+|\D+/g) ?? [];
  const maxLength = Math.max(partsA.length, partsB.length);

  for (let index = 0; index < maxLength; index += 1) {
    const partA = partsA[index];
    const partB = partsB[index];

    if (partA === undefined) {
      return -1;
    }

    if (partB === undefined) {
      return 1;
    }

    const numberA = Number(partA);
    const numberB = Number(partB);
    const areNumericParts =
      Number.isInteger(numberA) &&
      Number.isInteger(numberB) &&
      /^\d+$/.test(partA) &&
      /^\d+$/.test(partB);

    if (areNumericParts && numberA !== numberB) {
      return numberA - numberB;
    }

    if (partA !== partB) {
      return partA < partB ? -1 : 1;
    }
  }

  return 0;
}

function readGroupedSource(directoryPath: string): SourceCard[] {
  const filenames = readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort(compareEntries);

  if (filenames.length === 0) {
    throw new Error(`No JSON source files found in ${directoryPath}`);
  }

  return filenames.flatMap((filename) => {
    const filePath = join(directoryPath, filename);
    const items = JSON.parse(readFileSync(filePath, "utf8")) as string[];
    return items.map((text) => ({
      sourcePath: filePath,
      text
    }));
  });
}

function createCardId(type: "black" | "white", text: string): string {
  const hash = createHash("sha256")
    .update(`${type}:${text}`)
    .digest("hex")
    .slice(0, 16);
  return `${type}-${hash}`;
}

function assignBlackCardIds(items: SourceCard[]): GeneratedBlackCard[] {
  let expectedBlankLength: number | null = null;

  return items.map(({ sourcePath, text }) => {
    const blanks = text.match(blankPattern) ?? [];

    if (blanks.length !== 1) {
      throw new Error(
        `Black cards must contain exactly one blank placeholder in ${sourcePath}: ${JSON.stringify(text)}`
      );
    }

    const [blank] = blanks;
    const blankLength = blank.length;

    if (expectedBlankLength === null) {
      expectedBlankLength = blankLength;
    } else if (blankLength !== expectedBlankLength) {
      throw new Error(
        `Black card blank placeholders must all be the same length. Expected ${expectedBlankLength}, received ${blankLength} in ${sourcePath}: ${JSON.stringify(text)}`
      );
    }

    return {
      id: createCardId("black", text),
      text,
      pick: 1
    };
  });
}

function assignWhiteCardIds(items: SourceCard[]): GeneratedWhiteCard[] {
  return items.map(({ text }) => {
    return {
      id: createCardId("white", text),
      text
    };
  });
}

const blackSource = readGroupedSource(blackDirectory).sort((a, b) =>
  compareEntries(a.text, b.text)
);
const whiteSource = readGroupedSource(whiteDirectory).sort((a, b) =>
  compareEntries(a.text, b.text)
);

const blackCards = assignBlackCardIds(blackSource);
const whiteCards = assignWhiteCardIds(whiteSource);
const generatedDeckVersion = `cad-${blackCards.length}b-${whiteCards.length}w-v1`;

const file = `export const deckName = ${JSON.stringify(deckName)} as const;
export const deckVersion = ${JSON.stringify(generatedDeckVersion)} as const;

export type BlackCard = {
  id: string;
  text: string;
  pick: number;
};

export type WhiteCard = {
  id: string;
  text: string;
};

export const blackCards: readonly BlackCard[] = ${JSON.stringify(blackCards, null, 2)} as const;

export const whiteCards: readonly WhiteCard[] = ${JSON.stringify(whiteCards, null, 2)} as const;
`;

const prettierConfig = (await resolveConfig(outputPath)) ?? {};
const formattedFile = await format(file, {
  ...prettierConfig,
  endOfLine: "lf",
  filepath: outputPath
});

writeFileSync(outputPath, formattedFile);
console.log(`Generated ${outputPath}`);
