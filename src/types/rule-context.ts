import type { SourceUnit } from 'solidity-parser-antlr';
import type { Issue } from './issue';

/**
 * Context passed to rules when executing.
 * Contains the AST, file path, and helper methods.
 */
export interface RuleContext {
  /** Path to the Solidity file being scanned */
  filePath: string;

  /** Root AST node of the Solidity file */
  ast: SourceUnit;

  /**
   * Helper method: create an Issue object.
   * Rules should call this instead of manually constructing Issue.
   */
  report: (params: {
    ruleName: string;
    message: string;
    line: number;
    severity?: Issue['severity'];
  }) => Issue;
}
