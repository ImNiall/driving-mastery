#!/usr/bin/env node
/**
 * Mock test option length audit utility.
 *
 * Usage: node scripts/option-length-audit.cjs
 *
 * The script loads the question bank, calculates average character counts
 * for correct and incorrect answers per category, and highlights questions
 * where the correct answer exceeds the mean incorrect option length by more
 * than 20%.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");

const ROOT = path.resolve(__dirname, "..");
const QUESTION_BANK_PATH = path.join(ROOT, "lib/data/question-bank.ts");
const TYPES_PATH = path.join(ROOT, "types.ts");
const LENGTH_THRESHOLD = 0.2; // 20%

const moduleCache = new Map();

/**
 * Attempts to resolve a path by testing common TypeScript/JavaScript extensions.
 * @param {string} candidate
 * @returns {string|null}
 */
function resolveWithExtensions(candidate) {
  const extensions = ["", ".ts", ".tsx", ".js", ".cjs", ".mjs"];
  for (const ext of extensions) {
    const attempt = candidate.endsWith(ext) ? candidate : candidate + ext;
    if (fs.existsSync(attempt) && fs.statSync(attempt).isFile()) {
      return attempt;
    }
  }
  return null;
}

/**
 * Custom require function that can load TypeScript modules on demand.
 * @param {string} specifier
 * @param {string} parentPath
 * @returns {*}
 */
function customRequire(specifier, parentPath) {
  if (specifier === "zod") {
    return require("zod");
  }

  if (specifier === "@/types") {
    return loadTsModule(TYPES_PATH);
  }

  if (specifier.startsWith(".") || specifier.startsWith("/")) {
    const baseDir = specifier.startsWith("/")
      ? ROOT
      : path.dirname(parentPath);
    const target = resolveWithExtensions(path.resolve(baseDir, specifier));
    if (!target) {
      throw new Error(`Unable to resolve ${specifier} from ${parentPath}`);
    }
    if (target.endsWith(".ts") || target.endsWith(".tsx")) {
      return loadTsModule(target);
    }
    return require(target);
  }

  return require(specifier);
}

/**
 * Loads and evaluates a TypeScript module, caching the result.
 * @param {string} filePath
 * @returns {*}
 */
function loadTsModule(filePath) {
  const normalized = path.normalize(filePath);
  if (moduleCache.has(normalized)) {
    return moduleCache.get(normalized);
  }

  const sourceText = fs.readFileSync(normalized, "utf8");
  const transpiled = ts.transpileModule(sourceText, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: normalized,
  });

  const module = { exports: {} };
  const dirname = path.dirname(normalized);
  const context = {
    module,
    exports: module.exports,
    require: (specifier) => customRequire(specifier, normalized),
    __dirname: dirname,
    __filename: normalized,
    process,
    console,
    Buffer,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
  };

  vm.runInNewContext(transpiled.outputText, context, { filename: normalized });
  moduleCache.set(normalized, module.exports);
  return module.exports;
}

/**
 * Formats a ratio as a percentage string with one decimal place.
 * @param {number} ratio
 * @returns {string}
 */
function formatPercent(ratio) {
  return `${(ratio * 100).toFixed(1)}%`;
}

function main() {
  const { QUESTION_BANK } = loadTsModule(QUESTION_BANK_PATH);
  if (!Array.isArray(QUESTION_BANK)) {
    throw new Error("QUESTION_BANK did not load correctly.");
  }

  const categoryStats = new Map();
  const flagged = [];

  for (const question of QUESTION_BANK) {
    const correctOption = question.options.find((option) => option.isCorrect);
    const incorrectOptions = question.options.filter(
      (option) => !option.isCorrect,
    );

    if (!correctOption || incorrectOptions.length === 0) {
      // Skip malformed questions but continue processing others.
      continue;
    }

    const correctLength = correctOption.text.length;
    const incorrectLengths = incorrectOptions.map(
      (option) => option.text.length,
    );
    const incorrectMean =
      incorrectLengths.reduce((total, len) => total + len, 0) /
      incorrectLengths.length;

    const categoryKey = question.category;
    if (!categoryStats.has(categoryKey)) {
      categoryStats.set(categoryKey, {
        correctTotal: 0,
        correctCount: 0,
        incorrectTotal: 0,
        incorrectCount: 0,
      });
    }

    const stat = categoryStats.get(categoryKey);
    stat.correctTotal += correctLength;
    stat.correctCount += 1;
    stat.incorrectTotal += incorrectLengths.reduce((a, b) => a + b, 0);
    stat.incorrectCount += incorrectLengths.length;

    if (
      incorrectMean > 0 &&
      correctLength > incorrectMean * (1 + LENGTH_THRESHOLD)
    ) {
      flagged.push({
        id: question.id,
        category: categoryKey,
        correctLength,
        incorrectMean: Number(incorrectMean.toFixed(1)),
        ratio: correctLength / incorrectMean - 1,
        question: question.question,
      });
    }
  }

  const categoryRows = [];
  const overall = {
    correctTotal: 0,
    correctCount: 0,
    incorrectTotal: 0,
    incorrectCount: 0,
  };

  for (const [category, stat] of categoryStats.entries()) {
    const averageCorrect = stat.correctTotal / stat.correctCount || 0;
    const averageIncorrect = stat.incorrectTotal / stat.incorrectCount || 0;
    overall.correctTotal += stat.correctTotal;
    overall.correctCount += stat.correctCount;
    overall.incorrectTotal += stat.incorrectTotal;
    overall.incorrectCount += stat.incorrectCount;

    categoryRows.push({
      category,
      averageCorrect,
      averageIncorrect,
      delta: averageCorrect - averageIncorrect,
      ratio: averageIncorrect
        ? (averageCorrect - averageIncorrect) / averageIncorrect
        : 0,
    });
  }

  categoryRows.sort((a, b) => b.ratio - a.ratio);

  console.log("Category averages (sorted by correct-over-incorrect delta):");
  for (const row of categoryRows) {
    console.log(
      `- ${row.category}: correct=${row.averageCorrect.toFixed(1)}, incorrect=${row.averageIncorrect.toFixed(1)}, diff=${row.delta.toFixed(1)} (${formatPercent(row.ratio)})`,
    );
  }

  const overallCorrect =
    overall.correctCount > 0 ? overall.correctTotal / overall.correctCount : 0;
  const overallIncorrect =
    overall.incorrectCount > 0
      ? overall.incorrectTotal / overall.incorrectCount
      : 0;
  const overallRatio = overallIncorrect
    ? (overallCorrect - overallIncorrect) / overallIncorrect
    : 0;

  console.log("\nOverall:");
  console.log(
    `- correct=${overallCorrect.toFixed(1)}, incorrect=${overallIncorrect.toFixed(1)}, diff=${(overallCorrect - overallIncorrect).toFixed(1)} (${formatPercent(overallRatio)})`,
  );

  if (flagged.length) {
    console.log(
      `\nQuestions where the correct option exceeds mean distractor length by more than ${formatPercent(
        LENGTH_THRESHOLD,
      )}:`,
    );
    flagged
      .sort((a, b) => b.ratio - a.ratio)
      .forEach((item) => {
        console.log(
          `- [${item.category}] #${item.id}: correct=${item.correctLength}, mean incorrect=${item.incorrectMean} (${formatPercent(item.ratio)})`,
        );
      });
  } else {
    console.log(
      `\nNo questions exceed the ${formatPercent(LENGTH_THRESHOLD)} threshold.`,
    );
  }
}

main();
