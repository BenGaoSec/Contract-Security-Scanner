// src/rules/noLowLevelCall.ts

/**
 * Rule: no-low-level-call
 *
 * Flags usages of:
 *   - address.call()
 *   - address.delegatecall()
 *   - address.staticcall()
 *
 * Low-level calls are risky because they:
 *   - do not automatically revert on failure
 *   - bypass Solidity type safety
 *   - can introduce reentrancy issues
 *
 * This rule simply detects the patterns; it does not forbid them.
 */

import parser from 'solidity-parser-antlr';
import type { Rule, Issue, RuleContext } from '../types';

const NoLowLevelCallRule: Rule = {
  id: 'no-low-level-call',
  description: 'Detects use of .call, .delegatecall, and .staticcall.',
  defaultSeverity: 'WARNING',

  run(ctx: RuleContext): Issue[] {
    const issues: Issue[] = [];

    // Visitor for AST traversal. Cast to any because the parser's visitor
    // typing is incomplete and does not expose FunctionCall explicitly.
    const visitor: any = {
      FunctionCall(node: any) {
        const expr = node.expression;

        // Only match member access expressions like target.call(...)
        const isMemberAccess =
          expr &&
          expr.type === 'MemberAccess' &&
          typeof expr.memberName === 'string';

        if (!isMemberAccess) return;

        // Match low-level call variants
        const lowLevelMethods = ['call', 'delegatecall', 'staticcall'];

        if (!lowLevelMethods.includes(expr.memberName)) return;

        const line = node.loc?.start?.line ?? 0;

        issues.push(
          ctx.report({
            ruleName: NoLowLevelCallRule.id,
            message: `Low-level call detected: .${expr.memberName}().`,
            line,
            severity: NoLowLevelCallRule.defaultSeverity,
          }),
        );
      },
    };

    (parser as any).visit(ctx.ast as any, visitor);

    return issues;
  },
};

export default NoLowLevelCallRule;
