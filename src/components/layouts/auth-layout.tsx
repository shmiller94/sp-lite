import { ChevronLeft } from 'lucide-react';
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

import { Head } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Body2 } from '@/components/ui/typography';
import { useUser } from '@/lib/auth';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  className?: string;
};

const AuthStepLayoutHeader = () => {
  return (
    <section id="header" className="flex w-full items-center justify-between">
      <Button
        variant="glass"
        className="size-12 rounded-full"
        onClick={() => {}}
      >
        <ChevronLeft />
      </Button>
      <div className="w-[114px]">
        <img className="w-auto" src="/logo-dark.svg" alt="logo" />
      </div>
      <div className="size-12" />
    </section>
  );
};

export const AuthLayout = ({ children, title }: LayoutProps) => {
  const location = useLocation();
  const user = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (user.data) {
      navigate('/app', {
        replace: true,
      });
    }
  }, [user.data, navigate]);

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen w-full flex-col items-center justify-between py-8 md:py-12">
        <AuthStepLayoutHeader />
        {children}
        {location.pathname === '/auth/login' && (
          <div className="flex flex-col items-center justify-center gap-2">
            <Body2 className="text-zinc-500">Forgot password</Body2>
            <div className="flex items-center gap-0.5">
              <Body2 className="text-zinc-500">Don’t have an account?</Body2>
              <a
                href="https://google.com"
                className="cursor-pointer text-sm text-[#FC5F2B]"
                target="_blank"
                rel="noreferrer"
              >
                Sign up to our waitlist.
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
