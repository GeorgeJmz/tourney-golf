/**
 * Helper para normalizar fechas que pueden venir en diferentes formatos
 * Soporta: ISO 8601, MM/DD/YYYY
 * 
 * Este helper permite compatibilidad hacia atrás con datos legacy en formato ISO
 * mientras los nuevos datos se guardan directamente en MM/DD/YYYY
 */

/**
 * Detecta si una fecha está en formato MM/DD/YYYY
 */
const isMMDDYYYYFormat = (dateStr: string): boolean => {
  // Patrón: MM/DD/YYYY (exactamente 10 caracteres con formato específico)
  const pattern = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!pattern.test(dateStr)) {
    return false;
  }

  // Validar que sea una fecha válida
  const [month, day, year] = dateStr.split("/").map(Number);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;

  return true;
};

/**
 * Detecta si una fecha está en formato ISO
 */
const isISOFormat = (dateStr: string): boolean => {
  // Patrón ISO: YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss
  const pattern = /^\d{4}-\d{2}-\d{2}/;
  return pattern.test(dateStr);
};

/**
 * Convierte una fecha ISO a formato MM/DD/YYYY usando UTC
 * para evitar problemas de timezone
 */
const convertISOToMMDDYYYY = (isoDate: string): string => {
  const date = new Date(isoDate);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Normaliza una fecha a formato MM/DD/YYYY independientemente del formato de entrada
 * 
 * Soporta:
 * - MM/DD/YYYY (ya normalizado, lo devuelve tal cual)
 * - ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ o YYYY-MM-DD)
 * 
 * @param dateStr - Fecha en cualquier formato soportado
 * @returns Fecha en formato MM/DD/YYYY
 * @throws Error si el formato no es reconocido o la fecha es inválida
 */
export const normalizeDateToMMDDYYYY = (dateStr: string | undefined): string => {
  if (!dateStr || typeof dateStr !== "string") {
    throw new Error("Invalid date: date string is required");
  }

  // Si ya está en formato MM/DD/YYYY, devolverlo tal cual
  if (isMMDDYYYYFormat(dateStr)) {
    return dateStr;
  }

  // Si está en formato ISO, convertirlo
  if (isISOFormat(dateStr)) {
    try {
      return convertISOToMMDDYYYY(dateStr);
    } catch (error) {
      throw new Error(`Invalid ISO date: ${dateStr}`);
    }
  }

  // Si no reconocemos el formato, intentar parsearlo como ISO (último intento)
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${dateStr}`);
    }
    return convertISOToMMDDYYYY(dateStr);
  } catch (error) {
    throw new Error(`Unrecognized date format: ${dateStr}`);
  }
};

/**
 * Normaliza un array de fechas
 */
export const normalizeDateArray = (dates: string[] | undefined): string[] => {
  if (!dates || !Array.isArray(dates)) {
    return [];
  }
  return dates.map(date => normalizeDateToMMDDYYYY(date));
};

/**
 * Normaliza stagesDates (array de objetos con start/end)
 */
export const normalizeStagesDates = (
  stagesDates: Array<{ start: string; end: string }> | undefined
): Array<{ start: string; end: string }> => {
  if (!stagesDates || !Array.isArray(stagesDates)) {
    return [];
  }

  return stagesDates.map(stage => ({
    start: normalizeDateToMMDDYYYY(stage.start),
    end: normalizeDateToMMDDYYYY(stage.end),
  }));
};

/**
 * Normaliza todas las fechas de un tournament
 * Útil para procesar un tournament completo al leerlo de Firestore
 */
export const normalizeTournamentDates = (tournament: any) => {
  const normalized = { ...tournament };

  // Normalizar stagesDates
  if (normalized.stagesDates) {
    normalized.stagesDates = normalizeStagesDates(normalized.stagesDates);
  }

  // Normalizar championshipDate
  if (normalized.championshipDate) {
    try {
      normalized.championshipDate = normalizeDateToMMDDYYYY(normalized.championshipDate);
    } catch (error) {
      console.warn("Error normalizing championshipDate:", error);
    }
  }

  // Normalizar roundDates
  if (normalized.roundDates) {
    normalized.roundDates = normalizeDateArray(normalized.roundDates);
  }

  // Normalizar startDate
  if (normalized.startDate) {
    try {
      normalized.startDate = normalizeDateToMMDDYYYY(normalized.startDate);
    } catch (error) {
      console.warn("Error normalizing startDate:", error);
    }
  }

  // Normalizar cutOffDate
  if (normalized.cutOffDate) {
    try {
      normalized.cutOffDate = normalizeDateToMMDDYYYY(normalized.cutOffDate);
    } catch (error) {
      console.warn("Error normalizing cutOffDate:", error);
    }
  }

  // Normalizar playOffsStartDate
  if (normalized.playOffsStartDate) {
    try {
      normalized.playOffsStartDate = normalizeDateToMMDDYYYY(normalized.playOffsStartDate);
    } catch (error) {
      console.warn("Error normalizing playOffsStartDate:", error);
    }
  }

  // Normalizar playOffsCutOff
  if (normalized.playOffsCutOff) {
    try {
      normalized.playOffsCutOff = normalizeDateToMMDDYYYY(normalized.playOffsCutOff);
    } catch (error) {
      console.warn("Error normalizing playOffsCutOff:", error);
    }
  }

  return normalized;
};

/**
 * Normaliza las fechas de un player (array de fechas de matches)
 */
export const normalizePlayerDates = (player: any) => {
  const normalized = { ...player };

  if (normalized.date && Array.isArray(normalized.date)) {
    normalized.date = normalizeDateArray(normalized.date);
  }

  return normalized;
};

