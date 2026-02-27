import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

describe('rx-screen-out API', () => {
  it('does not keep a dead `response` prop', () => {
    const rxScreenOutPath = path.resolve(
      process.cwd(),
      'src/components/ui/questionnaire/rx-screen-out.tsx',
    );
    const rxScreenOutSource = readFileSync(rxScreenOutPath, 'utf8');

    expect(rxScreenOutSource).not.toContain('response: _response');
  });

  it('does not force callers to cast QuestionnaireResponse', () => {
    const rxQuestionnairePath = path.resolve(
      process.cwd(),
      'src/features/questionnaires/components/rx-questionnaire.tsx',
    );
    const rxQuestionnaireSource = readFileSync(rxQuestionnairePath, 'utf8');

    expect(rxQuestionnaireSource).not.toContain(
      'response={questionnaireResponse as unknown as QuestionnaireResponse}',
    );
  });
});
