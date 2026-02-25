import { format } from 'date-fns';

import { Link } from '@/components/ui/link';
import { Body2, Body3, H4 } from '@/components/ui/typography';

import { LegacyProtocol } from '../../../api';
import { ProtocolBook } from '../../protocol-book';

interface PastProtocolsProps {
  protocols: LegacyProtocol[];
}

export const PastProtocols = ({ protocols }: PastProtocolsProps) => {
  if (!protocols || protocols.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <H4>Past Protocols</H4>

      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:gap-12">
        {protocols.map((protocol) => {
          const supportingInfo = protocol.supportingInfo;

          return (
            <div key={protocol.id} className="space-y-4">
              <Link
                to="/protocol/legacy/$id"
                params={{ id: protocol.id }}
                className="group flex items-center gap-8 rounded-2xl border border-zinc-200 bg-white px-6 py-4 shadow-sm lg:rounded-none lg:border-none lg:p-0 lg:shadow-none"
              >
                <div className="flex items-center gap-4">
                  <ProtocolBook
                    className="w-16 -rotate-6 rounded-xl shadow-2xl lg:w-24 lg:rotate-0 max-lg:[&_#cover]:rounded-sm max-lg:[&_#date]:hidden max-lg:[&_p]:text-[10px]"
                    title="Protocol"
                    coverImage={'/protocol/protocol-book-cover.webp'}
                  />
                </div>
                <div className="lg:hidden">
                  <Body2>{protocol.title}</Body2>
                  <Body2 className="text-secondary">
                    {format(new Date(protocol.created), 'dd MMM yyyy')}
                  </Body2>
                  {supportingInfo && supportingInfo.length > 0 && (
                    <Body2 className="text-secondary">
                      {supportingInfo.map((si) => si.display).join(', ')}
                    </Body2>
                  )}
                </div>
              </Link>
              <Body3 className="hidden text-secondary md:block">
                {format(new Date(protocol.created), 'dd MMM, yyyy')}
              </Body3>
            </div>
          );
        })}
      </div>
    </div>
  );
};
