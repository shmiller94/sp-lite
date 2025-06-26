import { ContentLayout } from '@/components/layouts';
import { H1 } from '@/components/ui/typography';
import { SettingsListDesktop } from '@/features/settings/components/settings-list-desktop';
import { SettingsListMobile } from '@/features/settings/components/settings-list-mobile';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';

export const SettingsRoute = () => {
  const { width } = useWindowDimensions();
  return width > 768 ? (
    <ContentLayout title="Settings">
      <H1>Settings</H1>
      <SettingsListDesktop />
    </ContentLayout>
  ) : (
    <SettingsListMobile />
  );
};
