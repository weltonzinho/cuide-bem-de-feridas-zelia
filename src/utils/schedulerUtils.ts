import { Appointment } from '../types';

export interface TimeSlotCollisionResult {
  hasConflict: boolean;
  conflictReason?: string;
  conflictingAppointment?: Appointment;
  suggestedAvailableSlots?: string[];
}

// Convert "HH:MM" to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

// Convert minutes from midnight to "HH:MM"
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Calculates the operational occupied window for an appointment,
 * taking into account travel time before/after for domiciliary visits and sanitation/buffer time.
 */
export function getAppointmentTimeWindow(apt: {
  startTime: string;
  durationMinutes: number;
  isDomiciliary: boolean;
  travelTimeMinutes?: number;
  bufferTimeMinutes?: number;
}): { startMin: number; endMin: number; directStartMin: number; directEndMin: number } {
  const directStart = timeToMinutes(apt.startTime);
  const directEnd = directStart + apt.durationMinutes;

  // Travel time needed before arriving
  const travelBefore = apt.isDomiciliary ? (apt.travelTimeMinutes || 25) : 0;
  // Buffer time after procedure (hygiene, documentation, departure)
  const bufferAfter = (apt.bufferTimeMinutes || 15) + (apt.isDomiciliary ? (apt.travelTimeMinutes || 25) : 0);

  return {
    startMin: Math.max(0, directStart - travelBefore),
    endMin: directEnd + bufferAfter,
    directStartMin: directStart,
    directEndMin: directEnd,
  };
}

/**
 * Checks whether a requested appointment collides with any existing appointment on that day.
 */
export function checkScheduleConflict(
  existingAppointments: Appointment[],
  newAppointment: {
    id?: string;
    date: string;
    startTime: string;
    durationMinutes: number;
    isDomiciliary: boolean;
    travelTimeMinutes?: number;
    bufferTimeMinutes?: number;
  }
): TimeSlotCollisionResult {
  const targetDate = newAppointment.date;
  const candidateWindow = getAppointmentTimeWindow(newAppointment);

  // Filter appointments for the same day (excluding current if editing, and excluding cancelled)
  const dayAppointments = existingAppointments.filter(
    (apt) => apt.date === targetDate && 
             apt.id !== newAppointment.id && 
             apt.status !== 'cancelado'
  );

  for (const existing of dayAppointments) {
    const existingWindow = getAppointmentTimeWindow(existing);

    // Overlap condition:
    // candidate.start < existing.end AND candidate.end > existing.start
    const hasOverlap = candidateWindow.startMin < existingWindow.endMin && 
                       candidateWindow.endMin > existingWindow.startMin;

    if (hasOverlap) {
      let reason = '';
      if (candidateWindow.directStartMin < existingWindow.directEndMin && candidateWindow.directEndMin > existingWindow.directStartMin) {
        reason = `Choque direto de horário com "${existing.patientName}" (${existing.startTime} - ${minutesToTime(timeToMinutes(existing.startTime) + existing.durationMinutes)}).`;
      } else if (newAppointment.isDomiciliary || existing.isDomiciliary) {
        reason = `Conflito de deslocamento domiciliar com "${existing.patientName}". Tempo insuficiente de trânsito/buffer (${existing.isDomiciliary ? 'Visita Domiciliar' : 'Consulta'}).`;
      } else {
        reason = `Conflito com o intervalo de higienização/buffer do atendimento de "${existing.patientName}".`;
      }

      // Generate smart available slots suggestions on the same day (between 08:00 and 18:00)
      const suggestions = findAvailableTimeSlots(dayAppointments, newAppointment);

      return {
        hasConflict: true,
        conflictReason: reason,
        conflictingAppointment: existing,
        suggestedAvailableSlots: suggestions,
      };
    }
  }

  return { hasConflict: false };
}

/**
 * Finds alternative open slots on a given day that satisfy duration + travel requirements.
 */
export function findAvailableTimeSlots(
  dayAppointments: Appointment[],
  candidate: {
    durationMinutes: number;
    isDomiciliary: boolean;
    travelTimeMinutes?: number;
    bufferTimeMinutes?: number;
  },
  workStartHour = 8,
  workEndHour = 18
): string[] {
  const availableSlots: string[] = [];
  const candidateDuration = candidate.durationMinutes;
  const travel = candidate.isDomiciliary ? (candidate.travelTimeMinutes || 25) : 0;
  const buffer = (candidate.bufferTimeMinutes || 15) + travel;

  const startLimit = workStartHour * 60;
  const endLimit = workEndHour * 60;

  // Step in 30-minute intervals
  for (let t = startLimit; t + candidateDuration <= endLimit; t += 30) {
    const timeStr = minutesToTime(t);
    const candidateWin = {
      startMin: Math.max(0, t - travel),
      endMin: t + candidateDuration + buffer,
    };

    let collision = false;
    for (const existing of dayAppointments) {
      if (existing.status === 'cancelado') continue;
      const existingWin = getAppointmentTimeWindow(existing);
      if (candidateWin.startMin < existingWin.endMin && candidateWin.endMin > existingWin.startMin) {
        collision = true;
        break;
      }
    }

    if (!collision) {
      availableSlots.push(timeStr);
      if (availableSlots.length >= 4) break; // return top 4 best alternatives
    }
  }

  return availableSlots;
}

/**
 * Computes PUSH Tool score (Pressure Ulcer Scale for Healing).
 * Sub-scores: Sub-score 1 (Length x Width Area) + Sub-score 2 (Exudate Amount) + Sub-score 3 (Tissue Type)
 */
export function calculatePushToolScore(
  areaCm2: number,
  exudateAmount: string,
  predominantTissue: 'necrose' | 'esfacelo' | 'granulacao' | 'epitelizacao' | 'fechada'
): number {
  // Area score (0 to 10)
  let areaScore = 0;
  if (areaCm2 === 0) areaScore = 0;
  else if (areaCm2 < 0.3) areaScore = 1;
  else if (areaCm2 <= 0.6) areaScore = 2;
  else if (areaCm2 <= 1.0) areaScore = 3;
  else if (areaCm2 <= 2.0) areaScore = 4;
  else if (areaCm2 <= 3.0) areaScore = 5;
  else if (areaCm2 <= 4.0) areaScore = 6;
  else if (areaCm2 <= 8.0) areaScore = 7;
  else if (areaCm2 <= 12.0) areaScore = 8;
  else if (areaCm2 <= 24.0) areaScore = 9;
  else areaScore = 10;

  // Exudate score (0 to 3)
  let exudateScore = 0;
  if (exudateAmount === 'ausente') exudateScore = 0;
  else if (exudateAmount === 'escasso') exudateScore = 1;
  else if (exudateAmount === 'moderado') exudateScore = 2;
  else if (exudateAmount === 'abundante') exudateScore = 3;

  // Tissue score (0 to 4)
  let tissueScore = 0;
  if (predominantTissue === 'fechada') tissueScore = 0;
  else if (predominantTissue === 'epitelizacao') tissueScore = 1;
  else if (predominantTissue === 'granulacao') tissueScore = 2;
  else if (predominantTissue === 'esfacelo') tissueScore = 3;
  else if (predominantTissue === 'necrose') tissueScore = 4;

  return areaScore + exudateScore + tissueScore;
}
