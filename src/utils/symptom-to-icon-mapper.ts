import {
  Battery,
  Bone,
  Brain,
  Frown,
  Scale,
  Snowflake,
  Zap,
  Torus,
} from 'lucide-react';

const SYMPTOM_ICON_MAP: Record<string, any> = {
  low_energy: Battery,
  slower_fat_loss: Scale,
  coldness: Snowflake,
  muscle_aches: Zap,
  low_mood: Frown,
  bone_weakness: Bone,
  bloating: Torus,
  poor_digestion: Torus,
};

export const getSymptomIcon = (symptom: string) => {
  const key = symptom.toLowerCase().replace(/\s+/g, '_');
  return SYMPTOM_ICON_MAP[key] || Brain;
};
