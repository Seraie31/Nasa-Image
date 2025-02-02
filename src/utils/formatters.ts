export const formatDistance = (value: string, unit: 'lunar' | 'km'): string => {
  const numValue = parseFloat(value);
  return numValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
};

export const formatVelocity = (value: string): string => {
  const numValue = parseFloat(value);
  return numValue.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
};
