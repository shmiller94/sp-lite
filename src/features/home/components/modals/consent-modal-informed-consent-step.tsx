import { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Body1, Body2, H2 } from '@/components/ui/typography';
import { ConsentModalFooter } from '@/features/home/components/modals/consent-modal-footer';

export const InformedConsentStep = () => {
  const [isConsentChecked, setIsConsentChecked] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <DialogTitle className="mb-6 flex items-start justify-between">
        <H2 className="text-center">Informed Consent</H2>
      </DialogTitle>
      <div>
        <ScrollArea className="h-60 rounded-2xl border border-zinc-200 px-8 pt-8 [@media(min-height:844px)]:h-96">
          <div className="space-y-4 pl-2">
            <Body2 className="text-left font-semibold text-zinc-400">
              What is Telemedicine?
            </Body2>
            <Body2 className="text-left text-zinc-400">
              Telemedicine is the delivery of healthcare services, including
              examination, consultation, diagnosis, and treatment, through
              electronic communication technologies when you (the patient) are
              located in a different location than your healthcare provider.
            </Body2>
            <Body2 className="text-left font-semibold text-zinc-400">
              Benefits of Using Telemedicine
            </Body2>
            <Body2 className="text-left text-zinc-400">
              The benefits of telemedicine include having access to medical care
              anywhere you have access to the internet—including from the
              comfort of your home. Telemedicine means you don’t risk exposure
              to illness in busy waiting rooms, and you do not have to wait
              several days for an in-person appointment. Telemedicine also means
              you do not have to travel great distances to gain access to
              specialty care that may not be available in your community.
            </Body2>
            <Body2 className="text-left font-semibold text-zinc-400">
              Possible Risks of Using Telemedicine
            </Body2>
            <Body2 className="text-left text-zinc-400">
              As with any medical treatment, there are potential risks
              associated with the use of telemedicine. These risks may include,
              without limitation, the following:
            </Body2>
            <ul className="list-disc space-y-2 pl-4 text-zinc-400">
              <li>
                <Body2 className="text-zinc-400">
                  Delays in medical evaluation and consultation or treatment may
                  occur due to deficiencies or failures of the equipment or the
                  Internet, which may include poor video and data quality,
                  Internet outages, or other service interruption issues. You
                  may reschedule the visit with your healthcare provider should
                  these interruptions occur. If you need assistance in the event
                  of a telemedicine equipment failure, please contact us at:
                  concierge@superpower.com.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  Security protocols could fail, causing a breach of privacy of
                  personal medical information.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  Because Superpower does not have access to your complete
                  medical records, if you do not disclose to your healthcare
                  provider a sufficient amount of information concerning your
                  medical history, including diagnoses, treatments,
                  medications/supplements, and allergies, adverse treatment,
                  drug interactions, or allergic reactions, or other negative
                  outcomes may occur.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  Telemedicine services are NOT emergency services, and your
                  personal data WILL NOT BE MONITORED 24/7. If you think you are
                  experiencing a medical emergency, CALL 911 IMMEDIATELY.
                </Body2>
              </li>
            </ul>
            <Body2 className="text-zinc-400">
              THE CARE YOU RECEIVE WILL BE AT THE SOLE DISCRETION OF THE
              HEALTHCARE PROVIDER WHO IS TREATING YOU, WITH NO GUARANTEE OF
              DIAGNOSIS, TREATMENT, OR PRESCRIPTION. THE HEALTHCARE PROVIDER
              WILL DETERMINE WHETHER OR NOT THE CONDITION BEING DIAGNOSED AND/OR
              TREATED IS APPROPRIATE FOR A TELEMEDICINE ENCOUNTER VIA THE
              SERVICE.
            </Body2>
            <Body2 className="text-left font-semibold text-zinc-400">
              Your Rights and Acknowledgements
            </Body2>
            <ul className="list-disc space-y-2 pl-4 text-zinc-400">
              <li>
                <Body2 className="text-zinc-400">
                  You understand that certifying to or providing false,
                  misleading, or incomplete health information may result in
                  incorrect treatment, delayed care, or harm. You are
                  responsible for ensuring that the attestation you provide
                  under oath is accurate, complete, and fully covers all
                  information you know to be relevant to your prescription
                  request, your medical history and current condition. You also
                  confirm that any additional information you provide to an
                  Affiliated Provider, via secure texting, phone, audio, video,
                  or pictorially, about your medical history and current
                  condition will be truthful, accurate, and complete.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  You understand that there are no additional or hidden fees
                  associated with the use of telemedicine.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  You understand that your healthcare information may be shared
                  with other individuals in accordance with the Superpower Terms
                  of Service, Superpower Privacy Policy and regulations or laws
                  in the state or territory in which you are located. You
                  further understand that you have the right to request
                  disclosure of your Healthcare Information to any third party,
                  and that such disclosure will be made upon Superpower’s
                  receipt of your signed written authorization.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  You understand that dissemination of any personally
                  identifiable images or information from the telemedicine visit
                  to researchers or other entities will not occur without your
                  express written consent.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  Telemedicine may involve electronic communication of your
                  personal medical information to remote healthcare
                  practitioners who may be located outside of your state.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  You have the same privacy rights via telemedicine that you
                  would have during an in-person visit.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  You understand that no results can be guaranteed or
                  assured—you may not achieve the anticipated benefits of the
                  telemedicine services, and your condition may remain unchanged
                  or worsen despite treatment. You acknowledge that there is no
                  guarantee that you will be issued a prescription and that the
                  decision of whether a prescription is appropriate will be made
                  solely in the professional judgment of your Affiliated
                  Provider. You acknowledge that your Affiliated Provider may
                  determine that your condition requires in-person care, refuse
                  to prescribe a medication, and/or refer you accordingly.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  You understand that a variety of alternative methods of
                  medical care may be available to you, and that you may choose
                  one or more of these at any time.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  You understand that all information submitted to Superpower
                  will be part of your medical record, and you have the right to
                  review and receive copies of your medical records in
                  accordance with applicable law. For more information on how to
                  access your medical records, please contact
                  concierge@Superpower.com.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  You understand that your telemedicine visit may be with a
                  non-physician Affiliated Provider. You may request that your
                  telemedicine visit be scheduled with a physician.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  You acknowledge that there is a risk of technical failures
                  during the telehealth visit beyond the control of Superpower
                  and your Affiliated Provider and will hold the Affiliated
                  Provider and Superpower harmless for such loss.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  You will provide your accurate physical location when asked by
                  an Affiliated Provider to ensure that such provider is
                  licensed to provide telemedicine services to you. Your
                  Affiliated Provider will validate this prior to commencing
                  your visit.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  You consent to the disclosure of any medical records prepared
                  by Superpower to your primary care provider.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  FOR CALIFORNIA RESIDENTS: You acknowledge receipt of the
                  California Open Payments Database notice: The Open Payments
                  Database is a federal tool for researching payments made by
                  drug and medical device companies to physicians and hospitals.
                  It is available at https://openpaymentsdata.cms.gov.
                </Body2>
              </li>
              <li>
                <Body2 className="text-zinc-400">
                  You understand that telehealth is an evolving field, and its
                  applications may extend beyond what is described in this
                  consent.
                </Body2>
              </li>
            </ul>
            <Body2 className="text-zinc-400">
              This Telemedicine Informed Consent is valid for one (1) year from
              the initiation of your initial Telemedicine visit. If you would
              like to withdraw consent, you must do so prior to receiving any
              further treatment by emailing us at concierge@superpower.com. Your
              withdrawal of consent will not affect your right to future care or
              treatment.
            </Body2>
            <Body2 className="text-left font-semibold text-zinc-400">
              Complaints
            </Body2>
            <Body2 className="text-zinc-400">
              To file a complaint against a physician, please contact the state
              medical board in your state. You can find contact information for
              all US medical boards here:
              https://www.fsmb.org/contact-a-state-medical-board/.
            </Body2>
            <Body2 className="text-left font-semibold text-zinc-400">
              Acceptance
            </Body2>
            <Body2 className="text-zinc-400">
              By accepting this Consent to Telehealth, you agree and acknowledge
              that you have read and understood this Consent to Telehealth,
              including potential risks and benefits and your rights. By
              accepting, you consent to receive medical care via telehealth from
              Affiliated Providers (as such term is defined in the Superpower
              Privacy Policy) through Superpower.
            </Body2>
          </div>
        </ScrollArea>

        <div className="mt-8 flex items-center gap-3">
          <Checkbox
            id="consent-checkbox"
            checked={isConsentChecked}
            onCheckedChange={(checked) =>
              setIsConsentChecked(checked as boolean)
            }
          />
          <label htmlFor="consent-checkbox" className="cursor-pointer">
            <Body1 className="text-zinc-400">
              By clicking &ldquo;I agree&rdquo;, you acknowledge that you have
              read, understand and consent to the Informed Medical Consent
              policy.
            </Body1>
          </label>
        </div>
      </div>

      <ConsentModalFooter
        className="pt-10"
        isSubmitDisabled={!isConsentChecked}
      />
    </div>
  );
};
