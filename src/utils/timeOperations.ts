// Calculates the difference between given times and returns a string representating the time difference for eg. 13h, 2d, 1m, 3y

function timeDifference(currentDate: Date, oldDate: Date) {
  const timeDifference: number = currentDate.valueOf() - oldDate.valueOf();

  // Convert milliseconds to seconds, minutes, hours, and days
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = currentDate.getFullYear() - oldDate.getFullYear();

  if (years > 0) {
    return years.toString() + "y";
  }

  if (days > 0) {
    return days.toString() + "d";
  }

  if (hours > 0) {
    return hours.toString() + "h";
  }

  if (minutes > 0) {
    return minutes.toString() + "m";
  }

  if (seconds > 0) {
    return seconds.toString() + "s";
  }

  return "1s";
}

export { timeDifference };
