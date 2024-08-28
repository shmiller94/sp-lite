import React from 'react';

import { Head } from '@/components/seo';

type Props = {
  title: string;
  children: JSX.Element;
};

export const ConfiguratorLayout = (props: Props) => {
  return (
    <>
      <Head title={props.title} />
      {props.children}
    </>
  );
};
