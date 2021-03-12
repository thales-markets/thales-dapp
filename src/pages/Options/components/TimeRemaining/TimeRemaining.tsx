import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import intervalToDuration from 'date-fns/intervalToDuration';
//import differenceInHours from 'date-fns/differenceInHours';
import differenceInWeeks from 'date-fns/differenceInWeeks';
import { formattedDuration } from 'utils/formatters';
import useInterval from 'hooks/useInterval';

type TimeRemainingProps = {
    end: Date | number;
    onEnded?: () => void;
};

const ONE_SECOND_IN_MS = 1000;
//const ENDING_SOON_IN_HOURS = 48;

export const TimeRemaining: React.FC<TimeRemainingProps> = ({ end, onEnded }) => {
    const now = Date.now();
    const timeElapsed = now >= end;
    //const endingSoon = Math.abs(differenceInHours(now, end)) < ENDING_SOON_IN_HOURS;
    const weeksDiff = Math.abs(differenceInWeeks(now, end));
    const showRemainingInWeeks = weeksDiff > 4;
    const countdownDisabled = timeElapsed || showRemainingInWeeks;

    const [timeInterval, setTimeInterval] = useState<number | null>(countdownDisabled ? null : ONE_SECOND_IN_MS);

    const [duration, setDuration] = useState<Duration>(intervalToDuration({ start: now, end }));
    const { t } = useTranslation();

    useEffect(() => {
        if (onEnded && timeElapsed) {
            onEnded();
        }
    }, [onEnded, timeElapsed]);

    useInterval(() => {
        if (now <= end) {
            setDuration(intervalToDuration({ start: now, end }));
        } else {
            setTimeInterval(null);
        }
    }, timeInterval);

    return (
        <span style={{ fontSize: 12 }}>
            {timeElapsed
                ? t('options.common.time-remaining.ended')
                : showRemainingInWeeks
                ? `${weeksDiff} weeks`
                : formattedDuration(duration)}
        </span>
    );
};

export default TimeRemaining;
