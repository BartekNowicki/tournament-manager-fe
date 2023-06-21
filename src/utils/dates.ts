/* eslint-disable import/prefer-default-export */
// export const getAdjustedDates = (d1: string, d2: string): string => {
  export const getAdjustedDates = (d1: Date, d2: Date): string => {
  // need to set the date one day before as backend adds one day to the mysql value
  const adjustedStartDate = new Date(d1);
  const adjustedEndDate = new Date(d2);
  adjustedStartDate.setDate(adjustedStartDate.getDate() - 0);
  adjustedEndDate.setDate(adjustedEndDate.getDate() - 0);
  return `${adjustedStartDate.toLocaleDateString()} - ${adjustedEndDate.toLocaleDateString()}`;
};

// export const getDateOneDayBefore = (d: Date): Date => {
//   const adjustedDate = new Date(d);
//   adjustedDate.setDate(adjustedDate.getDate() - 1);
//   return adjustedDate;
// };
