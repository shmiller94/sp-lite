import {
  Ellipsis,
  EllipsisVertical,
  Database,
  Settings,
  LogOut,
  History,
  LucideIcon,
} from 'lucide-react';
import { SVGProps, FC, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import {
  DataIcon,
  HomeIcon,
  MarketplaceIcon,
  MessageIcon,
  ServicesIcon,
} from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/auth';
import { ROLES, useAuthorization } from '@/lib/authorization';
import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown';

type SideNavigationItem = {
  name: string;
  to: string;
  icon: LucideIcon | FC<SVGProps<SVGSVGElement>>;
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  const { data } = useUser();
  const { checkAccess } = useAuthorization();
  /*
   * Completely hides navbar from UI.
   *
   * Not the same as `disablePaddingBottom`.
   * */
  const hideNavBar = !data || data?.onboarding?.status === 'INCOMPLETE';

  /*
   * Leaves navbar on UI but removes padding bottom that was introduced
   *
   * for mobile devices to facilitate navigation.
   * */
  const disablePaddingBottom = pathname.startsWith('/concierge');

  const links: SideNavigationItem[] = [
    {
      icon: HomeIcon,
      name: 'Home',
      to: './',
    },
    {
      icon: DataIcon,
      name: 'Data',
      to: './data',
    },
    {
      icon: MessageIcon,
      name: 'Concierge',
      to: './concierge',
    },
    checkAccess({ allowedRoles: [ROLES.ADMIN] }) && {
      name: 'Admin',
      to: './admin/users',
      icon: Lock,
    },
  ].filter(Boolean) as SideNavigationItem[];

  const moreLinks: SideNavigationItem[] = [
    {
      icon: ServicesIcon,
      name: 'Services',
      to: './services',
    },
    {
      icon: MarketplaceIcon,
      name: 'Marketplace',
      to: 'https://products.superpower.com',
    },
    {
      icon: Database,
      name: 'Data Vault',
      to: './settings/vault',
    },
    {
      icon: History,
      name: 'Order History',
      to: './settings/purchases',
    },
    {
      icon: Settings,
      name: 'Settings',
      to: './settings',
      // to: isMobileView ? '/settings' : '/settings/profile',
    },
    {
      icon: LogOut,
      name: 'Logout',
      to: '/auth/logout',
    },
  ];

  return (
    <>
      <main
        id="app"
        className={cn(
          'flex min-h-screen w-full flex-col bg-white',
          hideNavBar ? '' : 'pb-24',
          disablePaddingBottom && '!p-0',
        )}
        // style={{
        //   backgroundImage: 'radial-gradient(#E8E8E8 1px, transparent 0)',
        //   backgroundSize: '20px 20px',
        //   backgroundPosition: '-12 -12',
        // }}
      >
        {children}
      </main>
      {hideNavBar ? null : (
        <SideNavigation links={links} moreLinks={moreLinks} />
      )}
    </>
  );
}

const SideNavigation: FC<{
  links: SideNavigationItem[];
  moreLinks?: SideNavigationItem[];
}> = ({ links, moreLinks }) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <ul className="fixed bottom-12 left-1/2 z-10 flex -translate-x-1/2 rounded-full bg-black p-1.5">
      {links.map((link, i) => {
        const isSelected = pathname === link.to;
        return (
          <NavLink
            key={i}
            to={link.to}
            /*
             * <NavLink to="/"> is an exceptional case because every URL matches /.
             * To avoid this matching every single route by default,
             * it effectively ignores the end prop and only matches when you're at the root route.
             * */
            end
            className={({ isActive }) =>
              [
                isActive ? 'bg-[#252525]' : '',
                'flex px-[14px] xs:px-4 py-2 xs:py-3 flex-col xs:flex-row items-center justify-center xs:justify-between gap-[5px] xs:gap-3 rounded-full hover:bg-[#252525] transition duration-200 ease-in-out cursor-pointer',
              ].join(' ')
            }
          >
            <link.icon
              className={cn(
                'w-3 xs:w-4 h-3 xs:h-4',
                isSelected ? 'opacity-100' : 'opacity-50',
              )}
              color="white"
            />

            <p
              className={cn(
                'text-[12px] xs:text-[16px] text-white leading-4 sm:leading-6',
                isSelected ? 'opacity-100' : 'opacity-50',
              )}
            >
              {link.name}
            </p>
          </NavLink>
        );
      })}
      {moreLinks && (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger
            className="rounded-full hover:bg-[#252525]"
            asChild
          >
            <Button
              variant="link"
              className="px-[14px] py-3 focus-visible:ring-transparent focus-visible:ring-offset-0 sm:px-4"
            >
              <EllipsisVertical
                size={18}
                color="white"
                className="block sm:hidden"
              />
              <Ellipsis color="white" className="hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[244px] rounded-3xl border-none bg-black p-1.5 text-white outline-none xs:w-[178px]"
            side="bottom"
            sideOffset={10}
            align="end"
          >
            <ul className="flex flex-col gap-1.5">
              {moreLinks.map((link, i) => (
                <NavLink
                  key={i}
                  to={link.to}
                  className="flex cursor-pointer items-center gap-3 rounded-[18px] p-4 transition duration-200 ease-in-out hover:bg-[#252525]"
                >
                  <link.icon width={12} height={12} color="white" />

                  <p className="text-sm text-white">{link.name}</p>
                </NavLink>
              ))}
            </ul>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </ul>
  );
};
