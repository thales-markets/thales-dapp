export const areDatesEqual = (date: number | undefined, dateString: string) => {
    if (!date) return false;

    const dateFromArray = new Date(date);
    const dateFromAPI = new Date(dateString);

    if (dateFromAPI.getTime() == dateFromArray.getTime()) return true;
    return false;
};
