import { NavLink, useLocation } from 'react-router-dom';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScheduleFlow } from '@/features/orders/components/schedule';
import { ServiceGroup } from '@/types/api';

export const ScheduleRoute = () => {
  const { search } = useLocation();

  const params = new URLSearchParams(search);

  const mode = params.get('mode');

  // TODO: probably validate mode
  return (
    <div className="mx-auto w-full max-w-3xl py-9">
      <ScheduleBreadcrumb />
      <ScheduleFlow mode={mode ? (mode as ServiceGroup) : 'phlebotomy'} />
    </div>
  );
};

const ScheduleBreadcrumb = () => {
  return (
    <Breadcrumb className="px-6 md:px-16">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NavLink to="/">Home</NavLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>Schedule</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
