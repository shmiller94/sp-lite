import { IssueSeverity, OperationOutcome } from '@/types/api';

export class OperationOutcomeError extends Error {
  readonly outcome: OperationOutcome;

  constructor(outcome: OperationOutcome, cause?: unknown) {
    super(operationOutcomeToString(outcome));
    this.outcome = outcome;
    this.cause = cause;
  }
}

/**
 * Returns a string represenation of the operation outcome.
 * @param outcome The operation outcome.
 * @returns The string representation of the operation outcome.
 */
export function operationOutcomeToString(outcome: OperationOutcome): string {
  const strs = [];
  if (outcome.issue) {
    for (const issue of outcome.issue) {
      let issueStr = issue.details?.text || 'Unknown error';
      if (issue.expression?.length) {
        issueStr += ` (${issue.expression.join(', ')})`;
      }
      strs.push(issueStr);
    }
  }
  return strs.length > 0 ? strs.join('; ') : 'Unknown error';
}

export function validationError(
  details: string,
  expression?: string,
): OperationOutcome {
  return {
    resourceType: 'OperationOutcome',
    issue: [
      {
        severity: IssueSeverity.ERROR,
        code: 'structure',
        details: {
          text: details,
        },
        expression: expression ? [expression] : undefined,
      },
    ],
  };
}
