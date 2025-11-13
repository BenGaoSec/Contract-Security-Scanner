import type { Issue } from './issue';
import type { RuleContext } from './rule-context';

/**
 * Base interface for a security rule.
 * All rules must implement this interface.
 */
export interface Rule {
  /** Unique rule identifier (e.g., "no-low-level-call") */
  id: string;

  /** Human-readable rule description */
  description: string;

  /** Default severity */
  defaultSeverity: 'INFO' | 'WARNING' | 'ERROR';

  /**
   * Execute this rule against a Solidity AST.
   * Should return any issues found in the file.
   */
  run: (ctx: RuleContext) => Issue[];
}
