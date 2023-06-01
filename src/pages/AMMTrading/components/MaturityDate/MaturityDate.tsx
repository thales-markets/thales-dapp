import { differenceInWeeks } from 'date-fns';
import intervalToDuration from 'date-fns/intervalToDuration';
import useInterval from 'hooks/useInterval';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { formatShortDate, formattedDuration, formattedDurationFull } from 'utils/formatters/date';

type MaturityDateProps = {
    maturityDateUnix: number;
    onEnded?: () => void;
    showFullCounter?: boolean;
    fontSize?: string;
    color?: string;
};

const ONE_SECOND_IN_MS = 1000;

const MaturityDate: React.FC<MaturityDateProps> = ({ maturityDateUnix, onEnded, showFullCounter, fontSize, color }) => {
    const { t } = useTranslation();
    const now = Date.now();
    const [showTimeRemaining, setTimeRemaningVisibility] = useState<boolean>(false);
    const [timeElapsed, setTimeElapsed] = useState(now >= maturityDateUnix);
    const [weeksDiff, setWeekDiff] = useState(Math.abs(differenceInWeeks(now, maturityDateUnix)));
    const [showRemainingInWeeks, setShowRemainingInWeeks] = useState(weeksDiff > 4);
    const [countdownDisabled, setCountdownDisabled] = useState(timeElapsed || showRemainingInWeeks);
    const [timeInterval, setTimeInterval] = useState<number | null>(countdownDisabled ? null : ONE_SECOND_IN_MS);
    const [duration, setDuration] = useState<Duration>(intervalToDuration({ start: now, end: maturityDateUnix }));

    const dateTimeTranslationMap = {
        years: t('options.common.time-remaining.years'),
        year: t('options.common.time-remaining.year'),
        months: t('options.common.time-remaining.months'),
        month: t('options.common.time-remaining.month'),
        weeks: t('options.common.time-remaining.weeks'),
        week: t('options.common.time-remaining.week'),
        days: t('options.common.time-remaining.days'),
        day: t('options.common.time-remaining.day'),
        hours: t('options.common.time-remaining.hours'),
        hour: t('options.common.time-remaining.hour'),
        minutes: t('options.common.time-remaining.minutes'),
        minute: t('options.common.time-remaining.minute'),
        seconds: t('options.common.time-remaining.seconds'),
        second: t('options.common.time-remaining.second'),
        'days-short': t('options.common.time-remaining.days-short'),
        'hours-short': t('options.common.time-remaining.hours-short'),
        'minutes-short': t('options.common.time-remaining.minutes-short'),
        'seconds-short': t('options.common.time-remaining.seconds-short'),
        'months-short': t('options.common.time-remaining.months-short'),
    };

    useEffect(() => {
        if (onEnded && timeElapsed) {
            onEnded();
        }
    }, [onEnded, timeElapsed]);

    useMemo(() => {
        const today = Date.now();
        setTimeElapsed(today >= maturityDateUnix);
        setWeekDiff(Math.abs(differenceInWeeks(today, maturityDateUnix)));
        setShowRemainingInWeeks(Math.abs(differenceInWeeks(today, maturityDateUnix)) > 4);
        setCountdownDisabled(today >= maturityDateUnix || Math.abs(differenceInWeeks(today, maturityDateUnix)) > 4);
        setDuration(intervalToDuration({ start: today, end: maturityDateUnix }));
    }, [maturityDateUnix]);

    useInterval(() => {
        if (now <= maturityDateUnix) {
            setDuration(intervalToDuration({ start: now, end: maturityDateUnix }));
        } else {
            setTimeElapsed(true);
            setTimeInterval(null);
        }
    }, timeInterval);

    return (
        <>
            <Display
                onMouseEnter={() => setTimeRemaningVisibility(true)}
                onMouseLeave={() => setTimeRemaningVisibility(false)}
                color={color}
                fontSize={fontSize}
            >
                {!showTimeRemaining
                    ? `${formatShortDate(maturityDateUnix)}`
                    : timeElapsed
                    ? t('options.common.time-remaining.ended')
                    : showRemainingInWeeks
                    ? `${weeksDiff} ${t('options.common.time-remaining.weeks')}`
                    : showFullCounter
                    ? formattedDurationFull(duration, dateTimeTranslationMap)
                    : formattedDuration(duration, dateTimeTranslationMap)}
            </Display>
        </>
    );
};

const Display = styled.span<{ fontSize?: string; color?: string }>`
    cursor: pointer;
    font-weight: 700;
    font-size: ${(props) => props.fontSize || '13px'};
    color: ${(props) => props.color || props.theme.textColor.primary};
    display: block;
`;

export default MaturityDate;
