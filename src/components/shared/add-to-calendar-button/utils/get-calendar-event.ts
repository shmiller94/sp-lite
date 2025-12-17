import { CalendarEvent } from 'calendar-link';
import { format } from 'date-fns';

import { Address, CollectionMethodType, Slot } from '@/types/api';
import { formatAddress } from '@/utils/format';

export const DESCRIPTION_IN_LAB_TEXT = (
  labLocation: string,
): string => `Your blood draw is scheduled at ${labLocation}. Your results will be uploaded to your dashboard once complete.


What to expect:

🧪 Results take ~10 days to fully process, but most will be visible within just a few days. 

🩸 The blood draw will only take ~10 min! Please remember to arrive at least 5 minutes before your appointment starts.


What to do:

🍽️ Fasting is required for 10 hours prior to your appointment. Drink plenty of water and no caffeine.


What to have ready:

1. Please take your Photo ID: with you to your lab visit - you will be required to show it.

2. Lab order and QR: Please show the PDFs attached when you arrive at the lab.


Just a reminder, your lab order can also be found in your Superpower app, under Data → Health Records. https://app.superpower.com/vault


To good health,
Superpower

P.S. don’t hesitate to text your concierge (+1-415-742-2828) if you have any questions.`;

export const DESCRIPTION_AT_HOME_TEXT = `Your blood draw is scheduled. Your results will be uploaded to your dashboard once complete.

What to expect:

🧪 Results take ~10 days to fully process, but most will be visible within just a few days. 

🩸 The blood draw will only take ~10 min and the nurse will arrive within your confirmed 2-hour window.


What to do:

🍽️ Fasting is required for 10 hours prior to your appointment. Drink plenty of water and no caffeine.


To good health,
Superpower

P.S. don’t hesitate to text your concierge (+1-415-742-2828) if you have any questions`;

export const getCalendarEvent = ({
  slot,
  address,
  collectionMethod,
  isCancerEvent = false,
}: {
  slot: Slot;
  address: Address;
  collectionMethod: CollectionMethodType;
  isCancerEvent?: boolean;
}) => {
  const labLocation = `${address?.line.join(' ')}, ${address?.city}, ${address?.state}, ${address?.postalCode}`;
  const cancerEvent: CalendarEvent = {
    title: 'Superpower - Cancer Test Window',
    start: slot?.start,
    duration: [
      (new Date(slot.end).getTime() - new Date(slot.start).getTime()) /
        (1000 * 60 * 60),
      'hour',
    ],
    description: `This test is sent by Superpower, made available by Grail Labs.
    
Your blood draw for the Grail Galleri Multi Cancer Detection Test  is scheduled at ${formatAddress(address)} on ${format(new Date(slot.start), 'EEEE, MMMM do, yyyy, h:mm a')}
Your results will be uploaded to your dashboard once complete.
    
What to expect:
🧪 The report will be ready in ~14 days, after your samples are received at the lab.
🩸 The blood draw will only take ~10 min! Please remember to have your phone at hand prior to the appointment for reminders and updates.
    
What to do:
✅No fasting or preparation is required for this test.
🩺 Your phlebotomist will collect, prepare, and ship your sample for you.
What to have ready:
    
01 – Please remember to have your test kit with you: Once your phlebotomist arrives, they'll guide you through the test's sample collection.`,
    location: labLocation,
  };

  const bloodDrawEvent: CalendarEvent = {
    title: 'Superpower - Lab Draw Window 💉👩',
    start: slot.start,
    duration: [
      (new Date(slot.end).getTime() - new Date(slot.start).getTime()) /
        (1000 * 60 * 60),
      'hour',
    ],
    description:
      collectionMethod === 'AT_HOME'
        ? DESCRIPTION_AT_HOME_TEXT
        : DESCRIPTION_IN_LAB_TEXT(labLocation),
    location: labLocation,
  };

  if (isCancerEvent) {
    return cancerEvent;
  }

  return bloodDrawEvent;
};
