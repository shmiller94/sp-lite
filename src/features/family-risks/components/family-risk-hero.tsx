export const FamilyRiskHero = () => {
  return (
    <div className="relative -mt-16 w-full overflow-hidden lg:-mt-24">
      <img
        src="/family-risk/family-baby.webp"
        className="mx-auto aspect-[5/4] w-full object-cover object-top"
        alt="Family Insights"
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskPosition: 'center top',
          maskPosition: 'center top',
        }}
      />
    </div>
  );
};
