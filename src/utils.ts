import { FilterPeriod } from "./app/Enum/FilterPeriod";

export const getRandomBlackShade = () => {
  const randomShade = Math.floor(Math.random() * 256);
  return `rgb(${randomShade}, ${randomShade}, ${randomShade})`;
};

export const getDateRange = (
  period: FilterPeriod
): { startDate: Date; endDate: Date } => {
  const currentDate = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (period) {
    case FilterPeriod.week:
      const lastWeekStart = new Date(currentDate);
      lastWeekStart.setDate(currentDate.getDate() - currentDate.getDay() - 7);
      const lastWeekEnd = new Date(lastWeekStart);
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
      startDate = lastWeekStart;
      endDate = lastWeekEnd;
      break;

    case FilterPeriod.year:
      const lastYearStart = new Date(currentDate.getFullYear() - 1, 0, 1);
      const lastYearEnd = new Date(currentDate.getFullYear() - 1, 11, 31);
      startDate = lastYearStart;
      endDate = lastYearEnd;
      break;

    default:
      const lastMonthStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
      const lastMonthEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );
      startDate = lastMonthStart;
      endDate = lastMonthEnd;
      break;
  }

  return { startDate, endDate };
};
