/* eslint-disable import/prefer-default-export */
export const getAdjustedDates = (d1, d2) => {
    // need to set the date one day before as backend adds one day to the mysql value
    const adjustedStartDate = new Date(d1);
    const adjustedEndDate = new Date(d2);
    adjustedStartDate.setDate(adjustedStartDate.getDate() - 1);
    adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);
    return `${adjustedStartDate.toLocaleDateString()} - ${adjustedEndDate.toLocaleDateString()}`;
};
export const getDateOneDayBefore = (d) => {
    const adjustedDate = new Date(d);
    adjustedDate.setDate(adjustedDate.getDate() - 1);
    return adjustedDate;
};
