import { Questionnaire, QuestionnaireResponse } from '@medplum/fhirtypes';

import { questionnaireStoreCreator } from '../../stores/questionnaire-store-creator';

describe('questionnaire-store cleanup', () => {
  describe('cleanResponseWhenDisabled', () => {
    it('should remove responses for questions that are no longer enabled', () => {
      // Create a questionnaire with conditional questions
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        id: 'test-questionnaire',
        item: [
          {
            linkId: 'q1',
            text: 'Do you have any allergies?',
            type: 'boolean',
          },
          {
            linkId: 'q2',
            text: 'Please list your allergies',
            type: 'string',
            enableWhen: [
              {
                question: 'q1',
                operator: '=',
                answerBoolean: true,
              },
            ],
          },
        ],
      };

      // Create an initial response with both questions answered
      const initialResponse: QuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'in-progress',
        item: [
          {
            linkId: 'q1',
            answer: [{ valueBoolean: true }],
          },
          {
            linkId: 'q2',
            answer: [{ valueString: 'Peanuts, dust, pollen' }],
          },
        ],
      };

      // Create store with initial response
      const store = questionnaireStoreCreator({
        questionnaire,
        initialResponse,
      });

      // Verify both questions are in the response
      const storeState = store.getState();
      expect(storeState.response.item).toHaveLength(2);
      expect(
        storeState.response.item?.find((item) => item.linkId === 'q2'),
      ).toBeTruthy();

      // Change the answer to q1 to false, which should disable q2
      store.getState().setItems({
        linkId: 'q1',
        answer: [{ valueBoolean: false }],
      });

      // Verify q2 has been removed from the response
      const updatedState = store.getState();
      expect(updatedState.response.item).toHaveLength(1);
      expect(
        updatedState.response.item?.find((item) => item.linkId === 'q2'),
      ).toBeUndefined();
    });

    it('should handle nested conditional questions within groups', () => {
      // Create a questionnaire with nested conditional questions
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        id: 'test-nested-questionnaire',
        item: [
          {
            linkId: 'group1',
            text: 'Medical History',
            type: 'group',
            item: [
              {
                linkId: 'q1',
                text: 'Do you have any medical conditions?',
                type: 'boolean',
              },
              {
                linkId: 'q2',
                text: 'Please describe your conditions',
                type: 'string',
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

      // Create an initial response with nested questions answered
      const initialResponse: QuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'in-progress',
        item: [
          {
            linkId: 'group1',
            item: [
              {
                linkId: 'q1',
                answer: [{ valueBoolean: true }],
              },
              {
                linkId: 'q2',
                answer: [{ valueString: 'Asthma, diabetes' }],
              },
            ],
          },
        ],
      };

      // Create store with initial response
      const store = questionnaireStoreCreator({
        questionnaire,
        initialResponse,
      });

      // Verify both questions are in the response
      const storeState = store.getState();
      const group = storeState.response.item?.[0];
      expect(group?.item).toHaveLength(2);
      expect(group?.item?.find((item) => item.linkId === 'q2')).toBeTruthy();

      // Change the answer to q1 to false, which should disable q2
      store.getState().setItems({
        linkId: 'q1',
        answer: [{ valueBoolean: false }],
      });

      // Verify q2 has been removed from the response
      const updatedState = store.getState();
      const updatedGroup = updatedState.response.item?.[0];
      expect(updatedGroup?.item).toHaveLength(1);
      expect(
        updatedGroup?.item?.find((item) => item.linkId === 'q2'),
      ).toBeUndefined();
    });

    it('should handle conditional groups and clean up all nested responses', () => {
      // Create a questionnaire with a conditional group
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        id: 'test-conditional-group',
        item: [
          {
            linkId: 'mainQuestion',
            text: 'Would you like to provide additional details?',
            type: 'boolean',
          },
          {
            linkId: 'detailsGroup',
            text: 'Additional Details',
            type: 'group',
            enableWhen: [
              {
                question: 'mainQuestion',
                operator: '=',
                answerBoolean: true,
              },
            ],
            item: [
              {
                linkId: 'detail1',
                text: 'Detail 1',
                type: 'string',
              },
              {
                linkId: 'detail2',
                text: 'Detail 2',
                type: 'string',
              },
            ],
          },
        ],
      };

      // Create an initial response with the group and its questions answered
      const initialResponse: QuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'in-progress',
        item: [
          {
            linkId: 'mainQuestion',
            answer: [{ valueBoolean: true }],
          },
          {
            linkId: 'detailsGroup',
            item: [
              {
                linkId: 'detail1',
                answer: [{ valueString: 'Detail answer 1' }],
              },
              {
                linkId: 'detail2',
                answer: [{ valueString: 'Detail answer 2' }],
              },
            ],
          },
        ],
      };

      // Create store with initial response
      const store = questionnaireStoreCreator({
        questionnaire,
        initialResponse,
      });

      // Verify the group and its questions are in the response
      const storeState = store.getState();
      expect(storeState.response.item).toHaveLength(2);
      const detailsGroup = storeState.response.item?.find(
        (item) => item.linkId === 'detailsGroup',
      );
      expect(detailsGroup?.item).toHaveLength(2);

      // Change the answer to mainQuestion to false, which should disable the entire details group
      store.getState().setItems({
        linkId: 'mainQuestion',
        answer: [{ valueBoolean: false }],
      });

      // Verify the details group has been removed from the response
      const updatedState = store.getState();
      expect(updatedState.response.item).toHaveLength(1);
      expect(
        updatedState.response.item?.find(
          (item) => item.linkId === 'detailsGroup',
        ),
      ).toBeUndefined();
    });

    it('should handle complex enableWhen conditions with multiple dependencies', () => {
      // Create a questionnaire with more complex conditional logic
      const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        id: 'test-complex-conditions',
        item: [
          {
            linkId: 'q1',
            text: 'Question 1',
            type: 'boolean',
          },
          {
            linkId: 'q2',
            text: 'Question 2',
            type: 'boolean',
          },
          {
            linkId: 'q3',
            text: 'Question 3',
            type: 'string',
            enableWhen: [
              {
                question: 'q1',
                operator: '=',
                answerBoolean: true,
              },
              {
                question: 'q2',
                operator: '=',
                answerBoolean: true,
              },
            ],
            enableBehavior: 'all',
          },
        ],
      };

      // Create an initial response with all questions answered
      const initialResponse: QuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'in-progress',
        item: [
          {
            linkId: 'q1',
            answer: [{ valueBoolean: true }],
          },
          {
            linkId: 'q2',
            answer: [{ valueBoolean: true }],
          },
          {
            linkId: 'q3',
            answer: [{ valueString: 'Answer to q3' }],
          },
        ],
      };

      // Create store with initial response
      const store = questionnaireStoreCreator({
        questionnaire,
        initialResponse,
      });

      // Verify all questions are in the response
      const storeState = store.getState();
      expect(storeState.response.item).toHaveLength(3);
      expect(
        storeState.response.item?.find((item) => item.linkId === 'q3'),
      ).toBeTruthy();

      // Change just one of the dependencies to false
      store.getState().setItems({
        linkId: 'q1',
        answer: [{ valueBoolean: false }],
      });

      // Verify q3 has been removed because all conditions must be met
      const updatedState = store.getState();
      expect(updatedState.response.item).toHaveLength(2);
      expect(
        updatedState.response.item?.find((item) => item.linkId === 'q3'),
      ).toBeUndefined();
    });
  });
});
