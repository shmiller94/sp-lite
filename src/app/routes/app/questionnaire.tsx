import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { IntakeQuestionnaire } from '@/features/questionnaires/components/intake-questionnaire';
import { ScreeningQuestionnaire } from '@/features/questionnaires/components/screening-questionnaire';

export const QuestionnaireRoute = () => {
  const [current, setCurrent] = useState<'all' | 'screening' | 'intake'>(
    'intake',
  );
  const { type } = useParams();
  const navigate = useNavigate();

  const onSubmit = () => {
    toast.success('Thanks for submission!');
    navigate('/');
  };

  switch (type) {
    case 'screening':
      return <ScreeningQuestionnaire showIntro={true} onSubmit={onSubmit} />;
    case 'intake':
      return <IntakeQuestionnaire showIntro={true} onSubmit={onSubmit} />;
    case 'all':
      return current === 'intake' ? (
        <IntakeQuestionnaire
          showIntro={true}
          onSubmit={() => {
            setCurrent('screening');
          }}
        />
      ) : (
        <ScreeningQuestionnaire showIntro={true} onSubmit={onSubmit} />
      );
  }
};
