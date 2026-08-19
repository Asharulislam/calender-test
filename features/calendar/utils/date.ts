export function dateAtDayOffset(offset: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
}

export function formatDecimalTime(value: number) {
  const hour = Math.floor(value);
  const minutes = Math.round((value - hour) * 60);
  return `${hour % 12 || 12}:${String(minutes).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
}
