import { Copy } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useInviteLink } from '../hooks/use-invite-link';

export const CopyLinkInput = () => {
  const { link } = useInviteLink();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center space-x-2">
      <Input type="text" value={link} readOnly />

      <Button onClick={handleCopy} className="flex items-center space-x-2">
        {!copied && <Copy className="mr-2 size-5" />}
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
    </div>
  );
};
