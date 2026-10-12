import * as dayjs from "dayjs";
import * as isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import * as isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ITournament } from "../types/DashboardLeagues";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * Parse different date input formats into a dayjs object
 * Soporta: MM/DD/YYYY, ISO 8601, timestamps, arrays [timestamp, timezone]
 */
const parseDate = (dateInput: unknown): dayjs.Dayjs | null => {
  if (!dateInput) {
    return null;
  }

  // If it's already a dayjs object
  if (dayjs.isDayjs(dateInput)) {
    return dateInput;
  }

  // If it's a string
  if (typeof dateInput === "string") {
    // Intentar parsear como MM/DD/YYYY primero
    const mmddyyyyPattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (mmddyyyyPattern.test(dateInput)) {
      const parsed = dayjs(dateInput, "MM/DD/YYYY");
      if (parsed.isValid()) {
        return parsed;
      }
    }

    // Fallback: intentar parsear como ISO u otro formato reconocido por dayjs
    const parsed = dayjs(dateInput);
    return parsed.isValid() ? parsed : null;
  }

  // If it's an array [timestamp, timezone]
  if (Array.isArray(dateInput) && dateInput.length === 2) {
    const timestamp = Number(dateInput[0]);
    if (!isNaN(timestamp)) {
      const parsed = dayjs(timestamp);
      return parsed.isValid() ? parsed : null;
    }
  }

  // If it's a Date object
  if (dateInput instanceof Date) {
    const parsed = dayjs(dateInput);
    return parsed.isValid() ? parsed : null;
  }

  // If it's a number (timestamp)
  if (typeof dateInput === "number") {
    const parsed = dayjs(dateInput);
    return parsed.isValid() ? parsed : null;
  }

  return null;
};

/**
 * Calculate the round number for a given date in a tournament
 * Returns:
 * - null if no round is scheduled for this date
 * - 0 for championship round
 * - 1+ for regular rounds
 *
 * Used for teamplay/dogfight/derby tournaments
 */
export const calculateRoundForDate = (
  tournament: ITournament,
  targetDate: dayjs.Dayjs
): number | null => {
  const isDerby = tournament.tournamentType === "derby";

  // Check regular rounds (specific dates) - for non-Derby tournaments
  if (tournament.roundDates && tournament.roundDates.length > 0 && !isDerby) {
    for (let i = 0; i < tournament.roundDates.length; i++) {
      const roundDate = parseDate(tournament.roundDates[i]);
      if (roundDate && roundDate.isSame(targetDate, "day")) {
        return i + 1; // Rounds are 1-based index
      }
    }
  }

  // Check championship round
  if (tournament.championshipRound) {
    const champDate = parseDate(tournament.championshipDate);
    if (champDate && champDate.isSame(targetDate, "day")) {
      return 0; // Championship round is 0
    }
  }

  // For Derby: roundDates is an array of date ranges (not specific dates)
  if (isDerby && tournament.roundDates && tournament.roundDates.length > 0) {
    const roundDatesAsRanges = tournament.roundDates as unknown as Array<{
      start: string;
      end: string;
    }>;
    
    for (let i = 0; i < roundDatesAsRanges.length; i++) {
      const stageStart = parseDate(roundDatesAsRanges[i].start);
      const stageEnd = parseDate(roundDatesAsRanges[i].end);
      if (
        stageStart &&
        stageEnd &&
        targetDate.isSameOrAfter(stageStart, "day") &&
        targetDate.isSameOrBefore(stageEnd, "day")
      ) {
        return i + 1; // Stage as round (1-based)
      }
    }
  }

  // For teamplay/dogfight with stages instead of specific rounds
  // A stage is a date range where players can play
  if (tournament.stagesDates && tournament.stagesDates.length > 0) {
    for (let i = 0; i < tournament.stagesDates.length; i++) {
      const stageStart = parseDate(tournament.stagesDates[i].start);
      const stageEnd = parseDate(tournament.stagesDates[i].end);
      if (
        stageStart &&
        stageEnd &&
        targetDate.isSameOrAfter(stageStart, "day") &&
        targetDate.isSameOrBefore(stageEnd, "day")
      ) {
        return i + 1; // Stage as round (1-based)
      }
    }
  }

  return null; // No round scheduled for this date
};

