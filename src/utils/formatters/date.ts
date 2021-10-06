import format from 'date-fns/format';
import { strPadLeft } from './string';

export const formatTxTimestamp = (timestamp: number | Date) => format(timestamp, 'MMM d, yy | HH:mm');

export const toJSTimestamp = (timestamp: number) => timestamp * 1000;

export const formatShortDate = (date: Date | number) => format(date, 'MMM d, yyyy');
export const formatShortDateWithTime = (date: Date | number) => format(date, 'MMM d, yyyy H:mm a');

export const secondsToTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds - minutes * 60;

    return strPadLeft(minutes, '0', 2) + ':' + strPadLeft(secondsLeft, '0', 2);
};

// date-fns formatDuration does not let us customize the actual string, so we need to write this custom formatter.
// TODO: support translations
export const formattedDuration = (
    duration: Duration,
    dateTimeTranslationMap: any,
    delimiter = ' ',
    firstTwo = false
) => {
    const formatted = [];
    if (duration.years) {
        return `${duration.years} ${
            duration.years > 1 ? dateTimeTranslationMap['years'] : dateTimeTranslationMap['year']
        }`;
    }
    if (duration.months) {
        return `${duration.months} ${
            duration.months > 1 ? dateTimeTranslationMap['months'] : dateTimeTranslationMap['month']
        }`;
    }
    if (duration.days) {
        return `${duration.days} ${duration.days > 1 ? dateTimeTranslationMap['days'] : dateTimeTranslationMap['day']}`;
    }
    if (duration.hours) {
        return `${duration.hours} ${
            duration.hours > 1 ? dateTimeTranslationMap['hours'] : dateTimeTranslationMap['hour']
        }`;
    }
    if (duration.minutes) {
        if (duration.minutes > 9) {
            return `${duration.minutes} ${dateTimeTranslationMap['minutes']}`;
        }
        formatted.push(`${duration.minutes}${dateTimeTranslationMap['minutes-short']}`);
    }
    if (duration.seconds != null) {
        formatted.push(`${duration.seconds}${dateTimeTranslationMap['seconds-short']}`);
    }
    return (firstTwo ? formatted.slice(0, 2) : formatted).join(delimiter);
};

export const formattedDurationFull = (
    duration: Duration,
    dateTimeTranslationMap: any,
    delimiter = ' ',
    firstTwo = false
) => {
    const formatted = [];
    formatted.push(`${duration.days}${dateTimeTranslationMap['days-short']}`);
    formatted.push(`${duration.hours}${dateTimeTranslationMap['hours-short']}`);
    formatted.push(`${duration.minutes}${dateTimeTranslationMap['minutes-short']}`);
    return (firstTwo ? formatted.slice(0, 2) : formatted).join(delimiter);
};

export const convertUTCToLocalDate = (date: Date) => {
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes()
    );
};

export const convertLocalToUTCDate = (date: Date) => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
};
