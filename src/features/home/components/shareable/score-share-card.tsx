import { HoverableCard } from '@/components/shared/hoverable-card';
import { SuperpowerScoreLogo } from '@/components/shared/score-logo';
import { Body1, H1, H2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface ScoreShareCardProps {
  name: string;
  score: number;
  className?: string;
  userAvatar?: string;
}

export const ScoreShareCard = ({
  name,
  score,
  className,
  userAvatar,
}: ScoreShareCardProps) => {
  const scoreMessage = (score: number): string => {
    if (score > 95) return "You're extremely healthy! Keep going!";
    if (score > 90) return "You're very healthy! Keep going!";
    if (score > 85) return "You're healthy! Keep going!";
    if (score > 80) return "You're doing well! Keep going!";
    if (score > 70) return "You're on the right track! Keep going!";
    return "You're getting started! Keep going!";
  };

  return (
    <div id="score-share-card">
      <HoverableCard
        className={cn(
          className,
          'md:h-[450px] h-[380px] w-64 md:w-[320px] bg-cover bg-[url("/cards/organic-orange.webp")] outline outline-white/25 -outline-offset-1 relative overflow-hidden',
        )}
        userAvatarImage={userAvatar}
        fallbackAvatarPath="/cards/card-fallback.webp"
        avatarOpacity={0.7}
      >
        <div className="relative z-[2] flex size-full flex-col justify-between p-0 md:p-2">
          <div className="mb-8 flex w-full items-start justify-between gap-8">
            <SuperpowerScoreLogo className="max-w-40 shrink" />
            <H1 className="m-0 shrink-0 text-5xl font-bold text-white">
              {score}
            </H1>
          </div>

          <div className="mt-auto">
            <H2 className="mb-4 text-2xl text-white">{name}</H2>

            <Body1 className="text-xl text-white/60">
              {scoreMessage(score)}
            </Body1>
          </div>
        </div>
      </HoverableCard>
    </div>
  );
};
