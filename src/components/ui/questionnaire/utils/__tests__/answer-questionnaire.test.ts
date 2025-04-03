import { Questionnaire, QuestionnaireResponseItem } from '@medplum/fhirtypes';

import { validateQuestionnairePageErrors } from '../validate-response-page';

describe('answer-questionnaire', () => {
  describe('validateQuestionnairePageErrors', () => {
    it('should return an error if page not found in questionnaire', () => {
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        item: [
          {
            linkId: 'page1',
            text: 'Page 1',
            type: 'group',
          },
        ],
      };

      const responseItems: QuestionnaireResponseItem[] = [];

      const errors = validateQuestionnairePageErrors(
        questionnaire,
        responseItems,
        'non-existent-page',
      );

      expect(errors).toEqual(['non-existent-page']);
    });

    it('should return no errors if page has no items', () => {
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        item: [
          {
            linkId: 'page1',
            text: 'Page 1',
            type: 'group',
          },
        ],
      };

      const responseItems: QuestionnaireResponseItem[] = [];

      const errors = validateQuestionnairePageErrors(
        questionnaire,
        responseItems,
        'page1',
      );

      expect(errors).toEqual([]);
    });

    it('should return no errors if page is not enabled', () => {
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        item: [
          {
            linkId: 'page1',
            text: 'Page 1',
            type: 'group',
            enableWhen: [
              {
                question: 'q0',
                operator: '=',
                answerString: 'Yes',
              },
            ],
            item: [
              {
                linkId: 'q1',
                text: 'Question 1',
                type: 'string',
                required: true,
              },
            ],
          },
        ],
      };

      const responseItems: QuestionnaireResponseItem[] = [
        {
          linkId: 'q0',
          answer: [{ valueString: 'No' }],
        },
      ];

      const errors = validateQuestionnairePageErrors(
        questionnaire,
        responseItems,
        'page1',
      );

      expect(errors).toEqual([]);
    });

    it('should return errors for required items without answers', () => {
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        item: [
          {
            linkId: 'page1',
            text: 'Page 1',
            type: 'group',
            item: [
              {
                linkId: 'q1',
                text: 'Question 1',
                type: 'string',
                required: true,
              },
              {
                linkId: 'q2',
                text: 'Question 2',
                type: 'string',
                required: false,
              },
            ],
          },
        ],
      };

      const responseItems: QuestionnaireResponseItem[] = [
        {
          linkId: 'page1',
          item: [
            {
              linkId: 'q2',
              answer: [{ valueString: 'Answer to q2' }],
            },
          ],
        },
      ];

      const errors = validateQuestionnairePageErrors(
        questionnaire,
        responseItems,
        'page1',
      );

      expect(errors).toEqual(['q1']);
    });

    it('should return errors for required items with empty answers array', () => {
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        item: [
          {
            linkId: 'page1',
            text: 'Page 1',
            type: 'group',
            item: [
              {
                linkId: 'q1',
                text: 'Question 1',
                type: 'string',
                required: true,
              },
            ],
          },
        ],
      };

      const responseItems: QuestionnaireResponseItem[] = [
        {
          linkId: 'page1',
          item: [
            {
              linkId: 'q1',
              answer: [],
            },
          ],
        },
      ];

      const errors = validateQuestionnairePageErrors(
        questionnaire,
        responseItems,
        'page1',
      );

      expect(errors).toEqual(['q1']);
    });

    it('should return no errors when all required fields have answers', () => {
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        item: [
          {
            linkId: 'page1',
            text: 'Page 1',
            type: 'group',
            item: [
              {
                linkId: 'q1',
                text: 'Question 1',
                type: 'string',
                required: true,
              },
              {
                linkId: 'q2',
                text: 'Question 2',
                type: 'boolean',
                required: true,
              },
            ],
          },
        ],
      };

      const responseItems: QuestionnaireResponseItem[] = [
        {
          linkId: 'page1',
          item: [
            {
              linkId: 'q1',
              answer: [{ valueString: 'Answer to q1' }],
            },
            {
              linkId: 'q2',
              answer: [{ valueBoolean: true }],
            },
          ],
        },
      ];

      const errors = validateQuestionnairePageErrors(
        questionnaire,
        responseItems,
        'page1',
      );

      expect(errors).toEqual([]);
    });

    it('should handle nested items within groups', () => {
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        item: [
          {
            linkId: 'page1',
            text: 'Page 1',
            type: 'group',
            item: [
              {
                linkId: 'group1',
                text: 'Group 1',
                type: 'group',
                item: [
                  {
                    linkId: 'q1',
                    text: 'Question 1',
                    type: 'string',
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      };

      const responseItems: QuestionnaireResponseItem[] = [
        {
          linkId: 'page1',
          item: [
            {
              linkId: 'group1',
              item: [
                {
                  linkId: 'q1',
                  answer: [],
                },
              ],
            },
          ],
        },
      ];

      const errors = validateQuestionnairePageErrors(
        questionnaire,
        responseItems,
        'page1',
      );

      expect(errors).toEqual(['q1']);
    });

    it('should handle required items with enablement conditions', () => {
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        item: [
          {
            linkId: 'page1',
            text: 'Page 1',
            type: 'group',
            item: [
              {
                linkId: 'q1',
                text: 'Question 1',
                type: 'boolean',
                required: false,
              },
              {
                linkId: 'q2',
                text: 'Question 2',
                type: 'string',
                required: true,
                enableWhen: [
                  {
                    question: 'q1',
                    operator: '=',
                    answerBoolean: true,
                  },
                ],
              },
            ],
          },
        ],
      };

      // Case 1: q1 = true, q2 enabled but missing
      let responseItems: QuestionnaireResponseItem[] = [
        {
          linkId: 'page1',
          item: [
            {
              linkId: 'q1',
              answer: [{ valueBoolean: true }],
            },
          ],
        },
      ];

      let errors = validateQuestionnairePageErrors(
        questionnaire,
        responseItems,
        'page1',
      );

      expect(errors).toEqual(['q2']);

      // Case 2: q1 = false, q2 disabled so no error
      responseItems = [
        {
          linkId: 'page1',
          item: [
            {
              linkId: 'q1',
              answer: [{ valueBoolean: false }],
            },
          ],
        },
      ];

      errors = validateQuestionnairePageErrors(
        questionnaire,
        responseItems,
        'page1',
      );

      expect(errors).toEqual([]);
    });
  });
});
