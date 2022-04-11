const fromJsDate = (date: Date) => ({
  year: date.getUTCFullYear(),
  month: date.getUTCMonth() + 1,
  day: date.getUTCDate(),
});

const asJsDate = (date: SimpleDate) => new Date(simpleDateToString(date));

const addDaysToDate = (date: Date, daysToAdvance: number) =>
  date.setUTCDate(date.getUTCDate() + daysToAdvance);

export const getNow = (): SimpleDate => fromJsDate(new Date());

export const getNextYear = (): SimpleDate => {
  const jsDate = asJsDate(getNow());
  jsDate.setUTCFullYear(jsDate.getUTCFullYear() + 1);
  return fromJsDate(jsDate);
};

const padZeros = (value: number, digits = 2) => {
  const valueAsString = value.toString();
  const digitsToPad = digits - valueAsString.length;
  return `${"0".repeat(digitsToPad)}${valueAsString}`;
};

export const simpleDateToString = (date: SimpleDate) =>
  [date.year, padZeros(date.month), padZeros(date.day)].join("-");

export const simpleDateFromString = (date: string): SimpleDate => {
  const [year, month, day] = date.split("-");
  return {
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
  };
};

export const getWeekRanges = (
  startDate: SimpleDate,
  endDate: SimpleDate
): SimpleDateRange[] => {
  const iterDate = asJsDate(startDate);
  const trueEndDate = asJsDate(endDate);
  if (iterDate >= trueEndDate) throw new Error(`End date must be after start`);

  const weekRanges: SimpleDateRange[] = [];
  const weekDayOffset = iterDate.getUTCDay();
  if (weekDayOffset) {
    const start = fromJsDate(iterDate);
    const daysUntilSunday = 6 - weekDayOffset;
    addDaysToDate(iterDate, daysUntilSunday);
    weekRanges.push({
      start: start,
      end: fromJsDate(iterDate),
    });
    addDaysToDate(iterDate, 1);
  }

  while (iterDate < trueEndDate) {
    const start = fromJsDate(iterDate);
    addDaysToDate(iterDate, 6);
    const end = fromJsDate(iterDate < trueEndDate ? iterDate : trueEndDate);
    addDaysToDate(iterDate, 1);
    weekRanges.push({ start, end });
  }

  return weekRanges;
};

const shortMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const toHumanDate = (
  simpleDate: SimpleDate,
  includeMonth: boolean,
  includeYear: boolean
) => {
  let dateText = simpleDate.day.toString();
  if (!includeMonth) return dateText;

  const monthName = shortMonthNames[simpleDate.month - 1];
  dateText = `${monthName} ${dateText}`;
  if (!includeYear) return dateText;

  return `${simpleDate.year} ${dateText}`;
};
