// src/core/scanner.ts
import fs from 'fs';
import path from 'path';
import { parse, type SourceUnit } from 'solidity-parser-antlr';
import { allRules } from '../rules';
import type { Issue, RuleContext } from '../types';

/**
 * Parse a Solidity source file and build its AST.
 */
function parseSolidityFile(filePath: string): SourceUnit {
  const source = fs.readFileSync(filePath, 'utf8');

  try {
    const ast = parse(source, {
      loc: true,
      tolerant: true,
    }) as SourceUnit;

    return ast;
  } catch (error) {
    const relative = path.relative(process.cwd(), filePath);
    // In a real tool, you might want a dedicated "parser-error" rule.
    throw new Error(`Failed to parse Solidity file: ${relative}\n${String(error)}`);
  }
}

/**
 * Build a RuleContext for a given file.
 */
function buildRuleContext(filePath: string, ast: SourceUnit): RuleContext {
  return {
    filePath,
    ast,
    report: ({ ruleName, message, line, severity }) => {
      return {
        ruleName,
        message,
        filePath,
        line,
        severity: severity ?? 'WARNING',
      };
    },
  };
}

/**
 * Scan a single Solidity file and return all detected issues.
 */
export function scanFile(filePath: string): Issue[] {
  const normalizedPath = path.resolve(filePath);
  const ast = parseSolidityFile(normalizedPath);
  const ctx = buildRuleContext(normalizedPath, ast);

  const issues: Issue[] = [];

  for (const rule of allRules) {
    const ruleIssues = rule.run(ctx);
    if (ruleIssues.length > 0) {
      issues.push(...ruleIssues);
    }
  }

  return issues;
}

/**
 * Scan multiple Solidity files and aggregate issues.
 */
export function scanFiles(filePaths: string[]): Issue[] {
  const allIssues: Issue[] = [];

  for (const filePath of filePaths) {
    const issues = scanFile(filePath);
    allIssues.push(...issues);
  }

  return allIssues;
}
