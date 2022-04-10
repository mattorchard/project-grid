const MILLIS_IN_DAY = 24 * 60 * 60 * 1_000;
export const DAYS_IN_WEEK = 7;
export const WEEKS_IN_YEAR = 52;

const fromJsDate = (date: Date) => ({
  year: date.getUTCFullYear(),
  month: date.getUTCMonth() + 1,
  day: date.getUTCDate(),
});

const asJsDate = (date: SimpleDate) => new Date(simpleDateToString(date));

export const getNow = (): SimpleDate => fromJsDate(new Date());
export const getNextWeek = (): SimpleDate =>
  fromJsDate(new Date(Date.now() + DAYS_IN_WEEK * MILLIS_IN_DAY));

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

const getDurationDays = (start: SimpleDate, end: SimpleDate) => {
  const iterDate = asJsDate(start);
  const targetDate = asJsDate(end);
  if (iterDate > targetDate)
    throw new Error(`Start date must be before end date`);
  let duration = 0;
  while (iterDate < targetDate) {
    iterDate.setUTCDate(iterDate.getUTCDate() + 1);
    duration += 1;
  }
  return duration;
};

export const getWeekCount = (startDate: string, endDate: string): number => {
  const startDateSimple = simpleDateFromString(startDate);
  const endDateSimple = simpleDateFromString(endDate);
  return Math.ceil(
    getDurationDays(startDateSimple, endDateSimple) / DAYS_IN_WEEK
  );
};

export const getEndDateString = (
  startDate: SimpleDate,
  durationWeeks: number
): string => {
  const trueEndDate = asJsDate(startDate);
  trueEndDate.setUTCDate(
    trueEndDate.getUTCDate() + DAYS_IN_WEEK * durationWeeks
  );
  return simpleDateToString(fromJsDate(trueEndDate));
};
