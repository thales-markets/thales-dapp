import { differenceInWeeks } from 'date-fns';
import intervalToDuration from 'date-fns/intervalToDuration';
import useInterval from 'hooks/useInterval';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { formatShortDate, formattedDuration, formattedDurationFull } from 'utils/formatters/date';

type MaturityDateProps = {
    maturityDateUnix: number;
    timeRemainingUnix: number;
    onEnded?: () => void;
    showFullCounter?: boolean;
    fontSize?: string;
    color?: string;
};

const ONE_SECOND_IN_MS = 1000;

const MaturityDate: React.FC<MaturityDateProps> = ({
    maturityDateUnix,
    timeRemainingUnix,
    onEnded,
    showFullCounter,
    fontSize,
    color,
}) => {
    const [showTimeRemaining, setTimeRemaningVisibility] = useState<boolean>(false);

    const now = Date.now();
    const [timeElapsed, setTimeElapsed] = useState(now >= timeRemainingUnix);
    const [weeksDiff, setWeekDiff] = useState(Math.abs(differenceInWeeks(now, timeRemainingUnix)));
    const [showRemainingInWeeks, setShowRemainingInWeeks] = useState(weeksDiff > 4);
    const [countdownDisabled, setCountdownDisabled] = useState(timeElapsed || showRemainingInWeeks);

    const [timeInterval, setTimeInterval] = useState<number | null>(countdownDisabled ? null : ONE_SECOND_IN_MS);
    const [duration, setDuration] = useState<Duration>(intervalToDuration({ start: now, end: timeRemainingUnix }));
    const { t } = useTranslation();

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
    };

    useEffect(() => {
        if (onEnded && timeElapsed) {
            onEnded();
        }
    }, [onEnded, timeElapsed]);

    useMemo(() => {
        const today = Date.now();
        setTimeElapsed(today >= timeRemainingUnix);
        setWeekDiff(Math.abs(differenceInWeeks(today, timeRemainingUnix)));
        setShowRemainingInWeeks(Math.abs(differenceInWeeks(today, timeRemainingUnix)) > 4);
        setCountdownDisabled(today >= timeRemainingUnix || Math.abs(differenceInWeeks(today, timeRemainingUnix)) > 4);
        setDuration(intervalToDuration({ start: today, end: timeRemainingUnix }));
    }, [timeRemainingUnix]);

    useInterval(() => {
        if (now <= timeRemainingUnix) {
            setDuration(intervalToDuration({ start: now, end: timeRemainingUnix }));
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
    font-family: Roboto !important;
    font-style: normal;
    font-weight: 700;
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '25px')};
    color: ${(_props) => (_props?.color ? _props.color : 'var(--primary-color)')};
    width: 140px;
    display: block;
    @media (max-width: 1024px) {
        font-size: 21px;
    }
    @media (max-width: 568px) {
        font-size: 18px;
    }
`;

export default MaturityDate;
