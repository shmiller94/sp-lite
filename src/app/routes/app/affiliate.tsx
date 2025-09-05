import { ContentLayout } from '@/components/layouts';
import { AffiliateBody } from '@/features/affiliate/components/affiliate-body';
import { AffilliateHero } from '@/features/affiliate/components/affiliate-hero';

export const AffiliateRoute = () => {
  return (
    <ContentLayout title="Invite friends & family">
      <div className="relative -mt-16 h-[600px] w-full pt-16 md:h-[700px] lg:mt-[-134px]">
        <AffilliateHero />

        {/* <div className="absolute bottom-0 z-50 h-40 w-full rounded-t-[32px] bg-white"></div> */}
        <div className="absolute left-1/2 top-0 h-full w-screen -translate-x-1/2 overflow-hidden bg-black">
          {/* FULL SCREEN BACKGROUND */}
          <div
            className="pointer-events-none absolute top-0 h-full w-screen"
            style={{
              background:
                'linear-gradient(268deg, #D13A07 -2.82%, #EB8A22 29.21%, #F68A1E 46.89%, #DF5713 98.37%)',
            }}
          ></div>
          {/* FULL SCREEN PAGE BORDER  */}
          <div className="absolute bottom-0 z-50 h-40 w-full rounded-t-[32px] bg-white"></div>
        </div>
      </div>
      <div className="relative -top-40  w-full bg-white ">
        <AffiliateBody />
      </div>
    </ContentLayout>
  );
};
