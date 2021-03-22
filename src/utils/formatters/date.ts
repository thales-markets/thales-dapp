import format from 'date-fns/format';
import { strPadLeft } from './string';

export const formatTxTimestamp = (timestamp: number | Date) => format(timestamp, 'MMM d, yy | HH:mm');

export const toJSTimestamp = (timestamp: number) => timestamp * 1000;

export const formatShortDate = (date: Date | number) => format(date, 'MMM d, yyyy');
export const formatShortDateWithTime = (date: Date | number) => format(date, 'MMM d, yyyy H:mma');

export const secondsToTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds - minutes * 60;

    return strPadLeft(minutes, '0', 2) + ':' + strPadLeft(secondsLeft, '0', 2);
};

// date-fns formatDuration does not let us customize the actual string, so we need to write this custom formatter.
// TODO: support translations
export const formattedDuration = (duration: Duration, delimiter = ' ', firstTwo = false) => {
    const formatted = [];
    if (duration.years) {
        formatted.push(`${duration.years}y`);
    }
    if (duration.months) {
        formatted.push(`${duration.months}mo`);
    }
    if (duration.days) {
        formatted.push(`${duration.days}d`);
    }
    if (duration.hours) {
        formatted.push(`${duration.hours}h`);
    }
    if (duration.minutes) {
        formatted.push(`${duration.minutes}m`);
    }
    if (duration.seconds != null) {
        formatted.push(`${duration.seconds}s`);
    }
    return (firstTwo ? formatted.slice(0, 2) : formatted).join(delimiter);
};
