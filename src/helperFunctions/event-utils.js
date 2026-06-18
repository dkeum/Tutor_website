let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: "I'm working",
    start: todayStr + "T09:00:00",
    end: todayStr + "T19:00:00",
    editable: false, // optional: prevent dragging
    extendedProps: {
      locked: true,
      type: "working",
    },
  },
  {
    id: createEventId(),
    title: "Book me",
    start: todayStr + "T20:00:00",
    end: todayStr + "T22:00:00",
    extendedProps: {
      locked: true,
      type: "working",
    },
  },

];

export function createEventId() {
  return String(eventGuid++);
}


export function formatHourNoDots(date) {
  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    })
    .replace(/\s?[AP]\.?M\.?/i, match =>
      match.toLowerCase().replace(".", "").replace(".", "")
    );
}


// Generate weekend availability (10:00–23:00)
export function generateWeekendAvailability(year, month) {
  const events = [];
  const date = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    date.setDate(day);
    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split("T")[0];

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      events.push({
        id: createEventId(),
        title: "Book me",
        start: `${dateStr}T10:00:00`,
        end: `${dateStr}T23:00:00`,
        extendedProps: {
          type: "availability",
          locked: false,
        },
      });
    }
  }
  return events;
}


// Generate weekday evening availability (19:30–23:00)
export function generateWeekdayAvailability(year, month) {
  const events = [];
  const date = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    date.setDate(day);
    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split("T")[0];

    // Weekdays Mon-Fri
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      events.push({
        id: createEventId(),
        title: "Book me",
        start: `${dateStr}T20:00:00`,
        end: `${dateStr}T23:00:00`,
        extendedProps: {
          type: "availability",
          locked: false,
        },
      });
    }
  }
  return events;
}