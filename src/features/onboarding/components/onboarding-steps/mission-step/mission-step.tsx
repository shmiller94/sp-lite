import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Activation } from './animation';

export const MissionStep = () => {
  const [sequence, setSequence] = useState<number>(1);
  const navigate = useNavigate();

  // Auto-scroll
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setSequence(2);
    }, 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  // Navigate to '/' when sequence reaches 3 (after Collage completes)
  useEffect(() => {
    if (sequence === 3) {
      // Pause for 2 seconds at the end before navigating
      const navigateTimer = setTimeout(() => {
        navigate('/');
      }, 2000);

      return () => {
        clearTimeout(navigateTimer);
      };
    }
  }, [sequence, navigate]);

  return <Activation sequence={sequence} setSequence={setSequence} />;
};
