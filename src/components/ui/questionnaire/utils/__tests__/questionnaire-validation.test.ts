import {
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from '@medplum/fhirtypes';

import { QuestionnaireItemType } from '../questionnaire-utils';
import {
  isResponseEmpty,
  ensureNestedResponseItems,
  validateRequiredFields,
} from '../questionnaire-validation';

describe('questionnaire-validation', () => {
  describe('isResponseEmpty', () => {
    const mockCheckEnabled = () => true;

    it('should return false for display type items', () => {
      const item: QuestionnaireItem = {
        linkId: 'display1',
        text: 'Display Text',
        type: QuestionnaireItemType.display,
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'display1',
      };

      const result = isResponseEmpty(item, response, mockCheckEnabled);
      expect(result).toBe(false);
    });

    it('should return true for non-group items with no answer', () => {
      const item: QuestionnaireItem = {
        linkId: 'q1',
        text: 'Question 1',
        type: QuestionnaireItemType.string,
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'q1',
      };

      const result = isResponseEmpty(item, response, mockCheckEnabled);
      expect(result).toBe(true);
    });

    it('should return true for non-group items with empty answer array', () => {
      const item: QuestionnaireItem = {
        linkId: 'q1',
        text: 'Question 1',
        type: QuestionnaireItemType.string,
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'q1',
        answer: [],
      };

      const result = isResponseEmpty(item, response, mockCheckEnabled);
      expect(result).toBe(true);
    });

    it('should return false for non-group items with an answer', () => {
      const item: QuestionnaireItem = {
        linkId: 'q1',
        text: 'Question 1',
        type: QuestionnaireItemType.string,
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'q1',
        answer: [{ valueString: 'Answer' }],
      };

      const result = isResponseEmpty(item, response, mockCheckEnabled);
      expect(result).toBe(false);
    });

    it('should check required nested items for group type items', () => {
      const item: QuestionnaireItem = {
        linkId: 'group1',
        text: 'Group 1',
        type: QuestionnaireItemType.group,
        item: [
          {
            linkId: 'q1',
            text: 'Question 1',
            type: QuestionnaireItemType.string,
            required: true,
          },
        ],
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'group1',
        item: [
          {
            linkId: 'q1',
            answer: [],
          },
        ],
      };

      const result = isResponseEmpty(item, response, mockCheckEnabled);
      expect(result).toBe(true);
    });

    it('should return false for group type with all required items answered', () => {
      const item: QuestionnaireItem = {
        linkId: 'group1',
        text: 'Group 1',
        type: QuestionnaireItemType.group,
        item: [
          {
            linkId: 'q1',
            text: 'Question 1',
            type: QuestionnaireItemType.string,
            required: true,
          },
        ],
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'group1',
        item: [
          {
            linkId: 'q1',
            answer: [{ valueString: 'Answer' }],
          },
        ],
      };

      const result = isResponseEmpty(item, response, mockCheckEnabled);
      expect(result).toBe(false);
    });
  });

  describe('ensureNestedResponseItems', () => {
    it('should do nothing for non-group items', () => {
      const item: QuestionnaireItem = {
        linkId: 'q1',
        text: 'Question 1',
        type: QuestionnaireItemType.string,
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'q1',
      };

      const originalResponse = { ...response };
      let onChangeCalled = false;

      ensureNestedResponseItems(item, response, () => {
        onChangeCalled = true;
      });

      expect(onChangeCalled).toBe(false);
      expect(response).toEqual(originalResponse);
    });

    it('should create item array if missing', () => {
      const item: QuestionnaireItem = {
        linkId: 'group1',
        text: 'Group 1',
        type: QuestionnaireItemType.group,
        item: [
          {
            linkId: 'q1',
            text: 'Question 1',
            type: QuestionnaireItemType.string,
          },
        ],
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'group1',
      };

      let result: QuestionnaireResponseItem[] | null = null;
      ensureNestedResponseItems(item, response, (items) => {
        result = items;
      });

      expect(result).toEqual([
        {
          linkId: 'group1',
          item: [
            {
              linkId: 'q1',
              text: 'Question 1',
            },
          ],
        },
      ]);
    });

    it('should add missing nested items', () => {
      const item: QuestionnaireItem = {
        linkId: 'group1',
        text: 'Group 1',
        type: QuestionnaireItemType.group,
        item: [
          {
            linkId: 'q1',
            text: 'Question 1',
            type: QuestionnaireItemType.string,
          },
          {
            linkId: 'q2',
            text: 'Question 2',
            type: QuestionnaireItemType.string,
          },
        ],
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'group1',
        item: [
          {
            linkId: 'q1',
            text: 'Question 1',
          },
        ],
      };

      let result: QuestionnaireResponseItem[] | null = null;
      ensureNestedResponseItems(item, response, (items) => {
        result = items;
      });

      expect(result).toEqual([
        {
          linkId: 'group1',
          item: [
            {
              linkId: 'q1',
              text: 'Question 1',
            },
            {
              linkId: 'q2',
              text: 'Question 2',
            },
          ],
        },
      ]);
    });
  });

  describe('validateRequiredFields', () => {
    const mockCheckEnabled = () => true;

    it('should return false for non-group items', () => {
      const item: QuestionnaireItem = {
        linkId: 'q1',
        text: 'Question 1',
        type: QuestionnaireItemType.string,
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'q1',
      };

      const result = validateRequiredFields(item, response, mockCheckEnabled);
      expect(result).toBe(false);
    });

    it('should return false if no required items', () => {
      const item: QuestionnaireItem = {
        linkId: 'group1',
        text: 'Group 1',
        type: QuestionnaireItemType.group,
        item: [
          {
            linkId: 'q1',
            text: 'Question 1',
            type: QuestionnaireItemType.string,
            required: false,
          },
        ],
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'group1',
        item: [
          {
            linkId: 'q1',
          },
        ],
      };

      const result = validateRequiredFields(item, response, mockCheckEnabled);
      expect(result).toBe(false);
    });

    it('should return an array of missing required field linkIds', () => {
      const item: QuestionnaireItem = {
        linkId: 'group1',
        text: 'Group 1',
        type: QuestionnaireItemType.group,
        item: [
          {
            linkId: 'q1',
            text: 'Question 1',
            type: QuestionnaireItemType.string,
            required: true,
          },
          {
            linkId: 'q2',
            text: 'Question 2',
            type: QuestionnaireItemType.string,
            required: true,
          },
        ],
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'group1',
        item: [
          {
            linkId: 'q1',
            answer: [],
          },
        ],
      };

      const result = validateRequiredFields(item, response, mockCheckEnabled);
      expect(result).toEqual(['q1', 'q2']);
    });

    it('should return false if all required fields have answers', () => {
      const item: QuestionnaireItem = {
        linkId: 'group1',
        text: 'Group 1',
        type: QuestionnaireItemType.group,
        item: [
          {
            linkId: 'q1',
            text: 'Question 1',
            type: QuestionnaireItemType.string,
            required: true,
          },
        ],
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'group1',
        item: [
          {
            linkId: 'q1',
            answer: [{ valueString: 'Answer' }],
          },
        ],
      };

      const result = validateRequiredFields(item, response, mockCheckEnabled);
      expect(result).toBe(false);
    });

    it('should find nested items by linkId if not found at the current level', () => {
      const item: QuestionnaireItem = {
        linkId: 'group1',
        text: 'Group 1',
        type: QuestionnaireItemType.group,
        item: [
          {
            linkId: 'q1',
            text: 'Question 1',
            type: QuestionnaireItemType.string,
            required: true,
          },
        ],
      };
      const response: QuestionnaireResponseItem = {
        linkId: 'group1',
        item: [
          {
            linkId: 'subgroup',
            item: [
              {
                linkId: 'q1',
                answer: [{ valueString: 'Answer' }],
              },
            ],
          },
        ],
      };

      const result = validateRequiredFields(item, response, mockCheckEnabled);
      expect(result).toBe(false);
    });
  });
});
