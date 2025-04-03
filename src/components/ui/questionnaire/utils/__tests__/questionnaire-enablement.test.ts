import {
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from '@medplum/fhirtypes';

import { isQuestionEnabled } from '../questionnaire-enablement';

describe('questionnaire-enablement', () => {
  describe('isQuestionEnabled', () => {
    it('should return true for items without enableWhen', () => {
      const item: QuestionnaireItem = {
        linkId: 'q1',
        text: 'Question 1',
        type: 'string',
      };

      const responseItems: QuestionnaireResponseItem[] = [];

      expect(isQuestionEnabled(item, responseItems)).toBe(true);
    });

    describe('enableBehavior: any (default)', () => {
      it('should return true if any enableWhen condition matches - exists:true', () => {
        const item: QuestionnaireItem = {
          linkId: 'q2',
          text: 'Question 2',
          type: 'string',
          enableWhen: [
            {
              question: 'q1',
              operator: 'exists',
              answerBoolean: true,
            },
          ],
        };

        const responseItems: QuestionnaireResponseItem[] = [
          {
            linkId: 'q1',
            answer: [{ valueString: 'Answer 1' }],
          },
        ];

        expect(isQuestionEnabled(item, responseItems)).toBe(true);
      });

      it('should return true if any enableWhen condition matches - exists:false', () => {
        const item: QuestionnaireItem = {
          linkId: 'q2',
          text: 'Question 2',
          type: 'string',
          enableWhen: [
            {
              question: 'q1',
              operator: 'exists',
              answerBoolean: false,
            },
          ],
        };

        const responseItems: QuestionnaireResponseItem[] = [];

        expect(isQuestionEnabled(item, responseItems)).toBe(true);
      });

      it('should return true if any enableWhen condition matches - = operator', () => {
        const item: QuestionnaireItem = {
          linkId: 'q2',
          text: 'Question 2',
          type: 'string',
          enableWhen: [
            {
              question: 'q1',
              operator: '=',
              answerString: 'Option A',
            },
            {
              question: 'q3',
              operator: '=',
              answerString: 'Option C',
            },
          ],
        };

        const responseItems: QuestionnaireResponseItem[] = [
          {
            linkId: 'q1',
            answer: [{ valueString: 'Option B' }],
          },
          {
            linkId: 'q3',
            answer: [{ valueString: 'Option C' }],
          },
        ];

        expect(isQuestionEnabled(item, responseItems)).toBe(true);
      });

      it('should return false if no enableWhen condition matches', () => {
        const item: QuestionnaireItem = {
          linkId: 'q2',
          text: 'Question 2',
          type: 'string',
          enableWhen: [
            {
              question: 'q1',
              operator: '=',
              answerString: 'Option A',
            },
            {
              question: 'q3',
              operator: '=',
              answerString: 'Option C',
            },
          ],
        };

        const responseItems: QuestionnaireResponseItem[] = [
          {
            linkId: 'q1',
            answer: [{ valueString: 'Option B' }],
          },
          {
            linkId: 'q3',
            answer: [{ valueString: 'Option D' }],
          },
        ];

        expect(isQuestionEnabled(item, responseItems)).toBe(false);
      });
    });

    describe('enableBehavior: all', () => {
      it('should return true if all enableWhen conditions match', () => {
        const item: QuestionnaireItem = {
          linkId: 'q2',
          text: 'Question 2',
          type: 'string',
          enableBehavior: 'all',
          enableWhen: [
            {
              question: 'q1',
              operator: '=',
              answerString: 'Option A',
            },
            {
              question: 'q3',
              operator: '=',
              answerString: 'Option C',
            },
          ],
        };

        const responseItems: QuestionnaireResponseItem[] = [
          {
            linkId: 'q1',
            answer: [{ valueString: 'Option A' }],
          },
          {
            linkId: 'q3',
            answer: [{ valueString: 'Option C' }],
          },
        ];

        expect(isQuestionEnabled(item, responseItems)).toBe(true);
      });

      it('should return false if any enableWhen condition does not match', () => {
        const item: QuestionnaireItem = {
          linkId: 'q2',
          text: 'Question 2',
          type: 'string',
          enableBehavior: 'all',
          enableWhen: [
            {
              question: 'q1',
              operator: '=',
              answerString: 'Option A',
            },
            {
              question: 'q3',
              operator: '=',
              answerString: 'Option C',
            },
          ],
        };

        const responseItems: QuestionnaireResponseItem[] = [
          {
            linkId: 'q1',
            answer: [{ valueString: 'Option A' }],
          },
          {
            linkId: 'q3',
            answer: [{ valueString: 'Option D' }],
          },
        ];

        expect(isQuestionEnabled(item, responseItems)).toBe(false);
      });
    });

    describe('nested items', () => {
      it('should handle deeply nested response items', () => {
        const item: QuestionnaireItem = {
          linkId: 'q4',
          text: 'Question 4',
          type: 'string',
          enableWhen: [
            {
              question: 'q3-1',
              operator: '=',
              answerString: 'Option C',
            },
          ],
        };

        const responseItems: QuestionnaireResponseItem[] = [
          {
            linkId: 'group1',
            item: [
              {
                linkId: 'group2',
                item: [
                  {
                    linkId: 'q3-1',
                    answer: [{ valueString: 'Option C' }],
                  },
                ],
              },
            ],
          },
        ];

        expect(isQuestionEnabled(item, responseItems)).toBe(true);
      });
    });

    describe('comparison operators', () => {
      it('should handle != operator', () => {
        const item: QuestionnaireItem = {
          linkId: 'q2',
          text: 'Question 2',
          type: 'string',
          enableWhen: [
            {
              question: 'q1',
              operator: '!=',
              answerString: 'Option A',
            },
          ],
        };

        const responseItems: QuestionnaireResponseItem[] = [
          {
            linkId: 'q1',
            answer: [{ valueString: 'Option B' }],
          },
        ];

        expect(isQuestionEnabled(item, responseItems)).toBe(true);
      });

      it('should handle > operator with numerical values', () => {
        const item: QuestionnaireItem = {
          linkId: 'q2',
          text: 'Question 2',
          type: 'string',
          enableWhen: [
            {
              question: 'q1',
              operator: '>',
              answerInteger: 5,
            },
          ],
        };

        const responseItems: QuestionnaireResponseItem[] = [
          {
            linkId: 'q1',
            answer: [{ valueInteger: 10 }],
          },
        ];

        expect(isQuestionEnabled(item, responseItems)).toBe(true);
      });

      it('should handle < operator with numerical values', () => {
        const item: QuestionnaireItem = {
          linkId: 'q2',
          text: 'Question 2',
          type: 'string',
          enableWhen: [
            {
              question: 'q1',
              operator: '<',
              answerInteger: 5,
            },
          ],
        };

        const responseItems: QuestionnaireResponseItem[] = [
          {
            linkId: 'q1',
            answer: [{ valueInteger: 3 }],
          },
        ];

        expect(isQuestionEnabled(item, responseItems)).toBe(true);
      });
    });

    describe('multi-select answers', () => {
      it('should check if any of the multi-select values match the expected value', () => {
        const item: QuestionnaireItem = {
          linkId: 'q2',
          text: 'Question 2',
          type: 'string',
          enableWhen: [
            {
              question: 'q1',
              operator: '=',
              answerString: 'Option B',
            },
          ],
        };

        const responseItems: QuestionnaireResponseItem[] = [
          {
            linkId: 'q1',
            answer: [
              { valueString: 'Option A' },
              { valueString: 'Option B' },
              { valueString: 'Option C' },
            ],
          },
        ];

        expect(isQuestionEnabled(item, responseItems)).toBe(true);
      });
    });
  });
});
