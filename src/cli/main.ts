// src/cli/main.ts

import path from 'path';
import { globSync } from 'glob';
import chalk from 'chalk';
import { scanFiles } from '../core/scanner';
import type { Issue } from '../types';

function formatIssue(issue: Issue): string {
  const relPath = path.relative(process.cwd(), issue.filePath);
  const location = `${relPath}:${issue.line}`;

  const severity =
    issue.severity === 'ERROR'
      ? chalk.red(issue.severity)
      : issue.severity === 'WARNING'
      ? chalk.yellow(issue.severity)
      : chalk.blue(issue.severity);

  return `${severity} [${issue.ruleName}] ${issue.message} (${location})`;
}

async function main(): Promise<void> {
  const patternFromArg = process.argv[2];
  const pattern = patternFromArg || 'contracts/**/*.sol';

  console.log(chalk.cyan(`Solidity Guardian v0.1.0`));
  console.log(chalk.gray(`Scanning pattern: ${pattern}\n`));

  // FIX: globSync (glob v10+)  
  const files = globSync(pattern, {
    absolute: true,
    nodir: true,
  });

  if (files.length === 0) {
    console.log(chalk.yellow('No Solidity files found.'));
    return;
  }

  const issues = scanFiles(files);

  if (issues.length === 0) {
    console.log(chalk.green('✅ No issues found.'));
    return;
  }

  for (const issue of issues) {
    console.log(formatIssue(issue));
  }

  console.log(chalk.red(`\nFound ${issues.length} issue(s) across ${files.length} file(s).`));
}

main().catch((err) => {
  console.error(chalk.red('Unexpected error in Solidity Guardian CLI:'));
  console.error(err);
  process.exit(1);
});
