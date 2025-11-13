/**
 * Represents a detected security issue in a Solidity file.
 */
export interface Issue {
  /** Name of the rule that detected the issue */
  ruleName: string;

  /** Path to the Solidity file */
  filePath: string;

  /** Human-readable description of the issue */
  message: string;

  /** Line number in the source file where the issue occurs */
  line: number;

  /** Severity of the issue (info, warning, error) */
  severity: Severity;
}

/**
 * Severity levels used by all rules.
 */
export type Severity = 'INFO' | 'WARNING' | 'ERROR';
