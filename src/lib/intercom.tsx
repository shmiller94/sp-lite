import { ReactNode, useEffect } from 'react';
import { IntercomProvider, useIntercom } from 'react-use-intercom';

const INTERCOM_APP_ID = 'sjl2rcf3';

interface ConditionalIntercomProviderProps {
  children: ReactNode;
}

const IntercomCleanup = () => {
  const { shutdown } = useIntercom();

  useEffect(() => {
    return () => {
      shutdown();
    };
  }, [shutdown]);

  return null;
};

export const ConditionalIntercomProvider = ({
  children,
}: ConditionalIntercomProviderProps) => {
  return (
    <IntercomProvider
      appId={INTERCOM_APP_ID}
      autoBoot={true}
      apiBase="https://api-iam.intercom.io"
    >
      <IntercomCleanup />
      {children}
    </IntercomProvider>
  );
};
