import dayjs from "dayjs";
import moment from "moment-timezone";

export const convertDate = (date: string): string =>
  dayjs(date).format("DD/MM/YYYY");

export const convertMomentDate = (date: Array<string>): string => {
  const nformattedDate = moment.tz(parseInt(date[0]), date[1]);
  return nformattedDate.format("MM/DD/YYYY");
};
