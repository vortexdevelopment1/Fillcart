/**
 * Delivery Slots Configuration & Dynamic Slot Generator
 * Aligned with frontend DELIVERY_SLOT_OPTIONS in ProductDetailPage.jsx
 * Timezone: Asia/Kolkata (IST = UTC+05:30)
 */

export const SLOT_DEFINITIONS = [
  {
    code: "morning",
    idSuffix: "morn",
    timeWindow: "7–9 AM",
    startTime: "07:00",
    endTime: "09:00",
    badge: "Morning",
    startHour: 7,
    startMinute: 0,
  },
  {
    code: "afternoon",
    idSuffix: "aft",
    timeWindow: "1–3 PM",
    startTime: "13:00",
    endTime: "15:00",
    badge: "Afternoon",
    startHour: 13,
    startMinute: 0,
  },
  {
    code: "evening",
    idSuffix: "eve",
    timeWindow: "7–9 PM",
    startTime: "19:00",
    endTime: "21:00",
    badge: "Evening",
    startHour: 19,
    startMinute: 0,
  },
];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Extracts IST (Asia/Kolkata) year, month, date, hours, minutes from a given Date/number.
 */
export function getIstDateTime(dateInput = new Date()) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  
  // Format to IST parts
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(d);
  const map = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = parseInt(part.value, 10);
    }
  }

  return {
    year: map.year,
    month: map.month, // 1-12
    day: map.day,
    hours: map.hour === 24 ? 0 : map.hour,
    minutes: map.minute,
  };
}

/**
 * Generates delivery slots for a range of days (1 to 3, default 2) relative to `now`.
 *
 * @param {Object} options
 * @param {number} [options.days=2] - Number of days to generate slots for (1..3)
 * @param {Date|string|number} [options.now=new Date()] - Reference timestamp for time checks
 * @returns {Array<{ id: string, date: string, label: string, startTime: string, endTime: string, available: boolean, badge: string|null }>}
 */
export function generateDeliverySlots({ days = 2, now = new Date() } = {}) {
  const safeDays = Math.max(1, Math.min(3, parseInt(days, 10) || 2));
  const refDate = now instanceof Date ? now : new Date(now);
  const istNow = getIstDateTime(refDate);

  const slots = [];

  for (let offset = 0; offset < safeDays; offset++) {
    // Add offset days in IST
    const targetDate = new Date(refDate.getTime() + offset * 24 * 60 * 60 * 1000);
    const istTarget = getIstDateTime(targetDate);

    const yearStr = String(istTarget.year);
    const monthStr = String(istTarget.month).padStart(2, "0");
    const dayStr = String(istTarget.day).padStart(2, "0");
    const ymd = `${yearStr}-${monthStr}-${dayStr}`;

    const isToday = offset === 0;
    const isTomorrow = offset === 1;

    for (const def of SLOT_DEFINITIONS) {
      let isAvailable = true;

      if (isToday) {
        // Slot has passed if current IST time is past slot's start time
        if (istNow.hours > def.startHour || (istNow.hours === def.startHour && istNow.minutes >= def.startMinute)) {
          isAvailable = false;
        }
      }

      // Slot ID & Label matching frontend format
      let id;
      let label;
      let badge = def.badge;

      if (isToday) {
        id = `slot-today-${def.idSuffix}`;
        label = `Today · ${def.timeWindow}`;
        if (def.code === "evening" && isAvailable) {
          badge = "Fastest";
        }
      } else if (isTomorrow) {
        id = `slot-tomorrow-${def.idSuffix}`;
        label = `Tomorrow · ${def.timeWindow}`;
      } else {
        const monthName = MONTH_NAMES[istTarget.month - 1];
        id = `slot-${ymd}-${def.idSuffix}`;
        label = `${istTarget.day} ${monthName} ${istTarget.year} · ${def.timeWindow}`;
        if (offset === 2 && def.code === "evening") {
          badge = "Standard";
        }
      }

      slots.push({
        id,
        date: ymd,
        label,
        startTime: def.startTime,
        endTime: def.endTime,
        available: isAvailable,
        badge,
      });
    }
  }

  return slots;
}
