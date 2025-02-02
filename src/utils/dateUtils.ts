export const formatDateForApod = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const createApodId = (date: Date | string): string => {
  return `apod-${formatDateForApod(date)}`;
};

export const isValidApodDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false;
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return false;
  }

  // APOD a commencé le 16 juin 1995
  const startDate = new Date('1995-06-16');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return d >= startDate && d <= today;
};

export const extractDateFromApodId = (apodId: string): string | null => {
  if (!apodId.startsWith('apod-')) {
    return null;
  }

  const date = apodId.replace('apod-', '');
  return isValidApodDate(date) ? date : null;
};
