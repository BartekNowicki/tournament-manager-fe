/* eslint-disable import/prefer-default-export */
// export const getAdjustedDates = (d1: string, d2: string): string => {
export const getAdjustedDates = (d1: Date, d2: Date): string => {
  const dayOffset = 0;
  // in case it is needed to set the date one day before if backend adds one day to the mysql value
  const adjustedStartDate = new Date(d1);
  const adjustedEndDate = new Date(d2);
  adjustedStartDate.setDate(adjustedStartDate.getDate() - dayOffset);
  adjustedEndDate.setDate(adjustedEndDate.getDate() - dayOffset);
  return `${adjustedStartDate.toLocaleDateString()} - ${adjustedEndDate.toLocaleDateString()}`;
};
