import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { HealthGradeComponent } from '@/components/ui/health-grade';
import { Separator } from '@/components/ui/separator';
import { Body1, Body2 } from '@/components/ui/typography';
import { CategoryScore } from '@/types/api';

export const ReportBlock = ({
  categoryScores,
  blockTitle,
}: {
  categoryScores: CategoryScore[];
  blockTitle: string;
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <Separator className="w-7" />
        <Body2 className="text-zinc-400">{blockTitle}</Body2>
      </div>
      {categoryScores.map((p, idx) => (
        <div className="flex items-center gap-4" key={idx}>
          <HealthGradeComponent grade={p.score} />
          <Body1>{p.categoryName}</Body1>
          {p.score === '-' ? (
            <Badge
              className="cursor-pointer gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-zinc-400"
              onClick={() => navigate('/services')}
            >
              <Body2 className="text-zinc-500">Get a score</Body2>
              <ArrowUpRight width={16} height={16} />
            </Badge>
          ) : null}
        </div>
      ))}
    </div>
  );
};
