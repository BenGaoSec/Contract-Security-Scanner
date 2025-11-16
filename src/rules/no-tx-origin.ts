import type { Rule } from "../types/rule";
import type { Issue } from "../types/issue";
import type { RuleContext } from "../types/rule-context";

export const noTxOriginRule: Rule = {
  id: "no-tx-origin",
  description: "Use of tx.origin is unsafe.",
  defaultSeverity: "ERROR",

  run(ctx: RuleContext): Issue[] {
    const issues: Issue[] = [];

    ctx.ast.walk((node: any) => {
      if (
        node.type === "MemberAccess" &&
        node.expression?.type === "Identifier" &&
        node.expression.name === "tx" &&
        node.memberName === "origin"
      ) {
        issues.push({
          ruleName: this.id,
          message: "Detected use of tx.origin",
          filePath: ctx.filePath,
          line: node.loc?.start.line ?? 0,
          severity: this.defaultSeverity,
        });
      }
    });

    return issues;
  },
};
