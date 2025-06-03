import * as moment from "moment-timezone";
export const getCurrentMoment = () => {
  const currentMoment = moment();
  return {
    eventDate: currentMoment.valueOf(),
    eventTimezone: "America/Los_Angeles",
  };
};
export const convertMomentDate = (date: Array<string>): string => {
  const nformattedDate = moment.tz(parseInt(date[0]), date[1]);
  return nformattedDate.format("MM/DD/YYYY");
};

export const getFormattedDate = () => {
  const { eventDate, eventTimezone } = getCurrentMoment();
  const timeZoneDate = [String(eventDate), eventTimezone];
  return { formattedDate: convertMomentDate(timeZoneDate), timeZoneDate };
};
export const convertDate = (date: string, format?: string): string => {
  const dateMoment = moment(date);
  return dateMoment.format(format);
};
