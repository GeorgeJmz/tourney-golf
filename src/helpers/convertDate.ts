import dayjs from "dayjs";
import moment from "moment-timezone";

export const convertDate = (date: string, format?: string): string =>
  dayjs(date).format(format || "DD/MM/YYYY");

export const convertMomentDate = (date: Array<string>): string => {
  const nformattedDate = moment.tz(parseInt(date[0]), date[1]);
  return nformattedDate.format("MM/DD/YYYY");
};

export const differenceDate = (
  date1: Array<string>,
  date2: Array<string>
): number => {
  const nformattedDate = moment.tz(parseInt(date1[0]), date1[1]);
  const nformattedDate2 = moment.tz(parseInt(date2[0]), date2[1]);
  return nformattedDate.isBefore(nformattedDate2) ? 0 : -1;
};
