export interface FeatureDefinition {
  id: number;
  name: string; // backend feature name
  label: string;
  description: string;
  path: string;
}

export const FEATURES: FeatureDefinition[] = Array.from({ length: 10 }).map(
  (_, index) => {
    const id = index + 1;
    const name = `feature_${id}`;
    return {
      id,
      name,
      label: `Feature ${id}`,
      description: `This is a placeholder page for ${name}.`,
      path: `/features/${name}`,
    };
  },
);


