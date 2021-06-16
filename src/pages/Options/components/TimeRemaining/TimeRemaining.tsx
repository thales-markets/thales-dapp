import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import intervalToDuration from 'date-fns/intervalToDuration';
//import differenceInHours from 'date-fns/differenceInHours';
import differenceInWeeks from 'date-fns/differenceInWeeks';
import { formattedDuration } from 'utils/formatters/date';
import useInterval from 'hooks/useInterval';

type TimeRemainingProps = {
    end: Date | number;
    onEnded?: () => void;
    fontSize?: number;
};

const ONE_SECOND_IN_MS = 1000;
//const ENDING_SOON_IN_HOURS = 48;

export const TimeRemaining: React.FC<TimeRemainingProps> = ({ end, onEnded, fontSize }) => {
    const now = Date.now();
    const [timeElapsed, setTimeElapsed] = useState(now >= end);
    const [weeksDiff, setWeekDiff] = useState(Math.abs(differenceInWeeks(now, end)));
    const [showRemainingInWeeks, setShowRemainingInWeeks] = useState(weeksDiff > 4);
    const [countdownDisabled, setCountdownDisabled] = useState(timeElapsed || showRemainingInWeeks);

    const [timeInterval, setTimeInterval] = useState<number | null>(countdownDisabled ? null : ONE_SECOND_IN_MS);
    const [duration, setDuration] = useState<Duration>(intervalToDuration({ start: now, end }));
    const { t } = useTranslation();

    useEffect(() => {
        if (onEnded && timeElapsed) {
            onEnded();
        }
    }, [onEnded, timeElapsed]);

    useMemo(() => {
        const today = Date.now();
        setTimeElapsed(today >= end);
        setWeekDiff(Math.abs(differenceInWeeks(today, end)));
        setShowRemainingInWeeks(Math.abs(differenceInWeeks(today, end)) > 4);
        setCountdownDisabled(today >= end || Math.abs(differenceInWeeks(today, end)) > 4);
        setDuration(intervalToDuration({ start: today, end }));
    }, [end]);

    useInterval(() => {
        if (now <= end) {
            setDuration(intervalToDuration({ start: now, end }));
        } else {
            setTimeElapsed(true);
            setTimeInterval(null);
        }
    }, timeInterval);

    return (
        <span style={{ fontSize: fontSize || 12 }}>
            {timeElapsed
                ? t('options.common.time-remaining.ended')
                : showRemainingInWeeks
                ? `${weeksDiff} weeks`
                : formattedDuration(duration)}
        </span>
    );
};

export default TimeRemaining;
