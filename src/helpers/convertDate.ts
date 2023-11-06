import dayjs from "dayjs";

export const convertDate = (date: string): string =>
  dayjs(date).format("DD/MM/YYYY");
