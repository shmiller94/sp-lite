import { getNormalStatus } from '@/features/biomarkers/utils/get-normal-status';
import { Biomarker, MetadataContent } from '@/types/api';

export const getNormalContent = (biomarker: Biomarker) => {
  const normalStatus = getNormalStatus(biomarker);

  /*
   * HIGH_NORMAL status means that current value is higher than high optimal
   * */
  if (normalStatus === 'HIGH_NORMAL') {
    const highMetadata = biomarker.metadata.content.filter(
      (content: MetadataContent) => {
        return content.status.toLowerCase() === 'high';
      },
    );

    return highMetadata.map((hm) => ({
      status: hm.status,
      /*
       * This removes out of range from default high value meta per Jacob's request
       *
       *  Jacob's message:
       * ```
       * and then the text that would surface under the "what does my high/low out of range level mean"
       *  in the app would need to change to remove the words "out of range"
       * ```
       * https://linear.app/superpower/issue/ENG-1625/add-conditional-explainer-logic-for-normal-states
       * */
      text: hm.text.replace('out of range', '').trim(),
      title: hm.title.replace('out of range', '').trim(),
    }));
  }

  /*
   * LOW_NORMAL status means that current value is lower than low optimal
   * */
  if (normalStatus === 'LOW_NORMAL') {
    const lowMetadata = biomarker.metadata.content.filter(
      (content: MetadataContent) => {
        return content.status.toLowerCase() === 'low';
      },
    );

    return lowMetadata.map((lm) => ({
      status: lm.status,
      /*
       * This removes out of range from default high value meta per Jacob's request
       *
       *  Jacob's message:
       * ```
       * and then the text that would surface under the "what does my high/low out of range level mean"
       *  in the app would need to change to remove the words "out of range"
       * ```
       * https://linear.app/superpower/issue/ENG-1625/add-conditional-explainer-logic-for-normal-states
       * */
      text: lm.text.replace('out of range', '').trim(),
      title: lm.title.replace('out of range', '').trim(),
    }));
  }

  /*
   * Return empty array just to be safe
   * */
  return [];
};
