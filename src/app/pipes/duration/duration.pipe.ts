import { Pipe, PipeTransform } from '@angular/core';

const MS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_YEAR = 365;

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(duration: number): string {
    const seconds = Math.ceil(duration / MS_IN_SECOND);

    if (seconds < SECONDS_IN_MINUTE) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
    const leftOverSeconds = seconds % SECONDS_IN_MINUTE;

    if (minutes < MINUTES_IN_HOUR) {
      return `${minutes}min ${leftOverSeconds}s`;
    }
    const hours = Math.floor(minutes / MINUTES_IN_HOUR);
    const leftOverMinutes = minutes % MINUTES_IN_HOUR;

    if (hours < HOURS_IN_DAY) {
      return `${hours}h ${leftOverMinutes}min ${leftOverSeconds}s`;
    }
    const days = Math.floor(hours / HOURS_IN_DAY);
    const leftOverHours = hours % HOURS_IN_DAY;

    if (days < DAYS_IN_YEAR) {
      return `${days}d ${leftOverHours}h`;
    }
    const years = Math.floor(days / DAYS_IN_YEAR);
    const leftOverDays = days % DAYS_IN_YEAR;

    if (years < 5 || (years === 5 && leftOverDays === 0)) {
      return `${years}y ${leftOverDays}d`;
    }
    return '> 5 years';
  }
}
