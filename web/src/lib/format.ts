export function formatRelativeDate(value: string) {
  if (!value) {
    return "No date";
  }

  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

export function statusLabel(status: string) {
  return {
    backlog: "Backlog",
    todo: "Todo",
    "in-progress": "In progress",
    done: "Done",
    blocked: "Blocked",
    cancelled: "Cancelled"
  }[status] ?? status;
}
