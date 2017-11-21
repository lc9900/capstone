export function daysInMonth(year, month) {
   // month in the argument above is 1-based
  return new Date(year, month, 0).getDate();
}

