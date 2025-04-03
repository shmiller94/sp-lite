import {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from '@medplum/fhirtypes';

import {
  buildInitialResponse,
  buildInitialResponseItem,
  mergeIndividualItems,
  mergeItems,
  mergeResponseItems,
} from '../questionnaire-builder';

describe('questionnaire-builder', () => {
  describe('buildInitialResponse', () => {
    it('should create a QuestionnaireResponse from a Questionnaire', () => {
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        id: 'test-questionnaire',
        status: 'active',
        item: [
          {
            linkId: 'q1',
            text: 'Question 1',
            type: 'string',
          },
          {
            linkId: 'q2',
            text: 'Question 2',
            type: 'boolean',
            initial: [{ valueBoolean: true }],
          },
        ],
      };

      const response = buildInitialResponse(questionnaire);

      expect(response.resourceType).toBe('QuestionnaireResponse');
      expect(response.questionnaire).toBe('Questionnaire/test-questionnaire');
      expect(response.status).toBe('in-progress');
      expect(response.item).toHaveLength(2);
      expect(response.item?.[0].linkId).toBe('q1');
      expect(response.item?.[0].text).toBe('Question 1');
      expect(response.item?.[0].answer).toEqual([]);
      expect(response.item?.[1].linkId).toBe('q2');
      expect(response.item?.[1].text).toBe('Question 2');
      expect(response.item?.[1].answer).toEqual([{ valueBoolean: true }]);
    });

    it('should handle nested items in the questionnaire', () => {
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        id: 'test-questionnaire',
        status: 'active',
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
              },
            ],
          },
        ],
      };

      const response = buildInitialResponse(questionnaire);

      expect(response.item).toHaveLength(1);
      expect(response.item?.[0].linkId).toBe('group1');
      expect(response.item?.[0].item).toHaveLength(1);
      expect(response.item?.[0].item?.[0].linkId).toBe('q1');
    });
  });

  describe('buildInitialResponseItem', () => {
    it('should create a QuestionnaireResponseItem from a QuestionnaireItem', () => {
      const item: QuestionnaireItem = {
        linkId: 'q1',
        text: 'Question 1',
        type: 'string',
      };

      const responseItem = buildInitialResponseItem(item);

      expect(responseItem.linkId).toBe('q1');
      expect(responseItem.text).toBe('Question 1');
      expect(responseItem.answer).toEqual([]);
      expect(responseItem.id).toBeDefined();
    });

    it('should include initial values if present', () => {
      const item: QuestionnaireItem = {
        linkId: 'q1',
        text: 'Question 1',
        type: 'string',
        initial: [{ valueString: 'Initial value' }],
      };

      const responseItem = buildInitialResponseItem(item);

      expect(responseItem.answer).toEqual([{ valueString: 'Initial value' }]);
    });
  });

  describe('mergeIndividualItems', () => {
    it('should merge two QuestionnaireResponseItems', () => {
      const prevItem: QuestionnaireResponseItem = {
        id: 'id-1',
        linkId: 'q1',
        text: 'Question 1',
        answer: [{ valueString: 'Previous answer' }],
      };

      const newItem: QuestionnaireResponseItem = {
        id: 'id-1',
        linkId: 'q1',
        text: 'Updated Question 1',
        answer: [{ valueString: 'New answer' }],
      };

      const mergedItem = mergeIndividualItems(prevItem, newItem);

      expect(mergedItem.id).toBe('id-1');
      expect(mergedItem.linkId).toBe('q1');
      expect(mergedItem.text).toBe('Updated Question 1');
      expect(mergedItem.answer).toEqual([{ valueString: 'New answer' }]);
    });

    it('should keep previous answer if new item has no answer', () => {
      const prevItem: QuestionnaireResponseItem = {
        id: 'id-1',
        linkId: 'q1',
        text: 'Question 1',
        answer: [{ valueString: 'Previous answer' }],
      };

      const newItem: QuestionnaireResponseItem = {
        id: 'id-1',
        linkId: 'q1',
        text: 'Updated Question 1',
        answer: [],
      };

      const mergedItem = mergeIndividualItems(prevItem, newItem);

      expect(mergedItem.answer).toEqual([{ valueString: 'Previous answer' }]);
    });

    it('should merge nested items', () => {
      const prevItem: QuestionnaireResponseItem = {
        id: 'id-1',
        linkId: 'group1',
        text: 'Group 1',
        item: [
          {
            id: 'id-2',
            linkId: 'q1',
            text: 'Question 1',
            answer: [{ valueString: 'Previous answer' }],
          },
        ],
      };

      const newItem: QuestionnaireResponseItem = {
        id: 'id-1',
        linkId: 'group1',
        text: 'Group 1',
        item: [
          {
            id: 'id-2',
            linkId: 'q1',
            text: 'Question 1',
            answer: [{ valueString: 'New answer' }],
          },
        ],
      };

      const mergedItem = mergeIndividualItems(prevItem, newItem);

      expect(mergedItem.item).toHaveLength(1);
      expect(mergedItem.item?.[0].answer).toEqual([
        { valueString: 'New answer' },
      ]);
    });
  });

  describe('mergeItems', () => {
    it('should merge two arrays of QuestionnaireResponseItems', () => {
      const prevItems: QuestionnaireResponseItem[] = [
        {
          id: 'id-1',
          linkId: 'q1',
          text: 'Question 1',
          answer: [{ valueString: 'Previous answer 1' }],
        },
        {
          id: 'id-2',
          linkId: 'q2',
          text: 'Question 2',
          answer: [{ valueString: 'Previous answer 2' }],
        },
      ];

      const newItems: QuestionnaireResponseItem[] = [
        {
          id: 'id-1',
          linkId: 'q1',
          text: 'Question 1',
          answer: [{ valueString: 'New answer 1' }],
        },
        {
          id: 'id-3',
          linkId: 'q3',
          text: 'Question 3',
          answer: [{ valueString: 'New answer 3' }],
        },
      ];

      const mergedItems = mergeItems(prevItems, newItems);

      expect(mergedItems).toHaveLength(3);
      expect(mergedItems[0].id).toBe('id-1');
      expect(mergedItems[0].answer).toEqual([{ valueString: 'New answer 1' }]);
      expect(mergedItems[1].id).toBe('id-2');
      expect(mergedItems[2].id).toBe('id-3');
    });
  });

  describe('mergeResponseItems', () => {
    it('should merge response answers into questionnaire items as initial values', () => {
      const questionnaireItems: QuestionnaireItem[] = [
        {
          linkId: 'q1',
          text: 'Question 1',
          type: 'string',
        },
        {
          linkId: 'q2',
          text: 'Question 2',
          type: 'boolean',
        },
      ];

      const responseItems: QuestionnaireResponseItem[] = [
        {
          linkId: 'q1',
          text: 'Question 1',
          answer: [{ valueString: 'Answer 1' }],
        },
        {
          linkId: 'q2',
          text: 'Question 2',
          answer: [{ valueBoolean: true }],
        },
      ];

      const mergedItems = mergeResponseItems(questionnaireItems, responseItems);

      expect(mergedItems).toHaveLength(2);
      expect(mergedItems[0].initial).toEqual([{ valueString: 'Answer 1' }]);
      expect(mergedItems[1].initial).toEqual([{ valueBoolean: true }]);
    });

    it('should handle nested items correctly', () => {
      const questionnaireItems: QuestionnaireItem[] = [
        {
          linkId: 'group1',
          text: 'Group 1',
          type: 'group',
          item: [
            {
              linkId: 'q1',
              text: 'Question 1',
              type: 'string',
            },
          ],
        },
      ];

      const responseItems: QuestionnaireResponseItem[] = [
        {
          linkId: 'group1',
          text: 'Group 1',
          item: [
            {
              linkId: 'q1',
              text: 'Question 1',
              answer: [{ valueString: 'Nested answer' }],
            },
          ],
        },
      ];

      const mergedItems = mergeResponseItems(questionnaireItems, responseItems);

      expect(mergedItems[0].item?.[0].initial).toEqual([
        { valueString: 'Nested answer' },
      ]);
    });
  });
});
