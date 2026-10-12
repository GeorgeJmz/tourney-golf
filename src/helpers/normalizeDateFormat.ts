/**
 * Helper para normalizar fechas en el frontend
 * Soporta: ISO 8601, MM/DD/YYYY, dayjs
 * 
 * Este helper permite compatibilidad hacia atrás con datos legacy en formato ISO
 * mientras los nuevos datos se guardan directamente en MM/DD/YYYY
 */

import dayjs, { Dayjs } from "dayjs";

/**
 * Detecta si una fecha está en formato MM/DD/YYYY
 */
const isMMDDYYYYFormat = (dateStr: string): boolean => {
  const pattern = /^\d{2}\/\d{2}\/\d{4}$/;
  return pattern.test(dateStr);
};

/**
 * Convierte cualquier formato de fecha a MM/DD/YYYY
 * Soporta: ISO, MM/DD/YYYY (retorna tal cual), Date, dayjs
 * 
 * @param date - Fecha en cualquier formato
 * @returns Fecha en formato MM/DD/YYYY
 */
export const normalizeDateToMMDDYYYY = (date: string | Date | Dayjs): string => {
  // Si ya está en formato MM/DD/YYYY, devolverlo tal cual
  if (typeof date === "string" && isMMDDYYYYFormat(date)) {
    return date;
  }

  // Convertir a dayjs y formatear
  const dayjsDate = dayjs(date);
  
  if (!dayjsDate.isValid()) {
    console.warn(`Invalid date: ${date}`);
    return dayjs().format("MM/DD/YYYY"); // Fallback a fecha actual
  }

  return dayjsDate.format("MM/DD/YYYY");
};

/**
 * Normaliza un array de fechas
 */
export const normalizeDateArray = (dates: Array<string | Date | Dayjs>): string[] => {
  return dates.map(date => normalizeDateToMMDDYYYY(date));
};

/**
 * Normaliza stagesDates (array de objetos con start/end)
 */
export const normalizeStagesDates = (
  stagesDates: Array<{ start: string | Date | Dayjs; end: string | Date | Dayjs }>
): Array<{ start: string; end: string }> => {
  return stagesDates.map(stage => ({
    start: normalizeDateToMMDDYYYY(stage.start),
    end: normalizeDateToMMDDYYYY(stage.end),
  }));
};

/**
 * Formato de fecha default para nuevos torneos
 */
export const getDefaultDateMMDDYYYY = (): string => {
  return dayjs().format("MM/DD/YYYY");
};

/**
 * Obtiene fecha futura en formato MM/DD/YYYY
 * @param daysInFuture - Número de días a agregar
 */
export const getFutureDateMMDDYYYY = (daysInFuture: number): string => {
  return dayjs().add(daysInFuture, "day").format("MM/DD/YYYY");
};

