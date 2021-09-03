import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import intervalToDuration from 'date-fns/intervalToDuration';
//import differenceInHours from 'date-fns/differenceInHours';
import differenceInWeeks from 'date-fns/differenceInWeeks';
import { formattedDuration } from 'utils/formatters/date';
import useInterval from 'hooks/useInterval';
import styled from 'styled-components';

type TimeRemainingProps = {
    end: Date | number;
    onEnded?: () => void;
    fontSize?: number;
    showBorder?: boolean;
};

const ONE_SECOND_IN_MS = 1000;
//const ENDING_SOON_IN_HOURS = 48;

export const TimeRemaining: React.FC<TimeRemainingProps> = ({ end, onEnded, fontSize, showBorder }) => {
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
        <Container fontSize={fontSize} duration={duration} showBorder={showBorder}>
            {timeElapsed
                ? t('options.common.time-remaining.ended')
                : showRemainingInWeeks
                ? `${weeksDiff} weeks`
                : formattedDuration(duration)}
        </Container>
    );
};

const getColor = (duration: Duration) => {
    if (duration.years || duration.months || duration.days) {
        return `#F6F6FE`;
    }
    if (duration.hours) {
        return `#FFCC00`;
    }
    if (duration.minutes && duration.minutes > 10) {
        if (duration.minutes > 10) {
            return `#FF8800`;
        }
    }
    return '#D82418';
};

const Container = styled.span<{ fontSize?: number; duration: Duration; showBorder?: boolean }>`
    font-size: ${(props) => props.fontSize || 12}px;
    @media (max-width: 512px) {
        font-size: ${(props) => props.fontSize || 10}px;
    }
    color: ${(props) => getColor(props.duration)};
    border: 1px solid
        ${(props) => (props.showBorder ? (getColor(props.duration) === '#D82418' ? '#D82418' : 'transparent') : 'none')};
    padding: ${(props) => (props.showBorder ? '2px 12px 4px 12px' : '0')};
    border-radius: ${(props) => (props.showBorder ? '5px' : '0')};
    text-align: center;
    z-index: 3;
    white-space: pre;
`;

export default TimeRemaining;
