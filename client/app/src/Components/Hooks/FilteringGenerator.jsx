export const getYearOptions = () => {
    const currentYear = dayjs().year();
    return Array.from({ length: 5 }, (_, i) => {
        const year = currentYear - i;
        return { value: `${year}`, label: `${year}` };
    });
};

export const getMonthOptions = () => {
    const currentYear = dayjs().year();
    return Array.from({ length: 12 }, (_, i) => {
        const month = dayjs().month(i);
        return {
            value: `${currentYear}-${String(i + 1).padStart(2, "0")}`,
            label: month.format("MMMM YYYY"),
        };
    });
};

export const getWeekOptions = () => {
    const currentYear = dayjs().year();
    const weeks = dayjs(`${currentYear}-12-31`).isoWeeksInYear();
    return Array.from({ length: weeks }, (_, i) => {
        const week = i + 1;
        return {
            value: `${currentYear}-W${String(week).padStart(2, "0")}`,
            label: `Week ${week}, ${currentYear}`,
        };
    });
};