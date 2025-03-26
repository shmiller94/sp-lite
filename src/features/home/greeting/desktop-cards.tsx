import { DataCard } from './data-card';

interface DesktopCardsProps {
  cards: ReadonlyArray<{
    type: 'superpower-score' | 'biological-age' | 'protocol';
    onClick?: () => void;
  }>;
  dataState: 'loading' | 'loaded' | 'error';
  healthScoreData?: any;
  biologicalAge?: number | null;
  ageDifference?: number | null;
}

export const DesktopCards = ({
  cards,
  dataState,
  healthScoreData,
  biologicalAge,
  ageDifference,
}: DesktopCardsProps) => {
  return (
    <div className="hidden md:grid md:grid-cols-3 md:gap-8">
      {cards.map((card, index) => (
        <div
          key={card.type}
          className="m-0 w-full rounded-2xl border-0 bg-transparent p-0 text-left outline-none transition-all duration-200 focus:scale-105 focus:outline-1 focus:outline-white/20"
        >
          <DataCard
            dataState={dataState}
            healthScoreData={healthScoreData}
            biologicalAge={biologicalAge}
            ageDifference={ageDifference}
            cardType={card.type}
            onClick={card.onClick}
            animationDelay={index * 0.25}
          />
        </div>
      ))}
    </div>
  );
};
