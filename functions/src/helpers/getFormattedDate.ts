import * as moment from "moment-timezone";
export const getFormattedDate = () => {
  const getCurrentMoment = () => {
    const currentMoment = moment();
    return {
      eventDate: currentMoment.valueOf(),
      eventTimezone: moment.tz.guess(),
    };
  };
  const convertMomentDate = (date: Array<string>): string => {
    const nformattedDate = moment.tz(parseInt(date[0]), date[1]);
    return nformattedDate.format("MM/DD/YYYY");
  };
  const { eventDate, eventTimezone } = getCurrentMoment();
  const timeZoneDate = [String(eventDate), eventTimezone];
  return { formattedDate: convertMomentDate(timeZoneDate), timeZoneDate };
};
