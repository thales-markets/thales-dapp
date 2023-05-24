import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import intervalToDuration from 'date-fns/intervalToDuration';
import differenceInWeeks from 'date-fns/differenceInWeeks';
import { formattedDuration, formattedDurationFull } from 'utils/formatters/date';
import useInterval from 'hooks/useInterval';
import styled from 'styled-components';
import { ThemeInterface } from 'types/ui';

type TimeRemainingProps = {
    end: Date | number;
    onEnded?: () => void;
    fontSize?: number;
    showBorder?: boolean;
    showFullCounter?: boolean;
    zIndex?: number;
};

const ONE_SECOND_IN_MS = 1000;
//const ENDING_SOON_IN_HOURS = 48;

export const TimeRemaining: React.FC<TimeRemainingProps> = ({
    end,
    onEnded,
    fontSize,
    showBorder,
    showFullCounter,
    zIndex,
}) => {
    const now = Date.now();
    const [timeElapsed, setTimeElapsed] = useState(now >= Number(end));
    const [weeksDiff, setWeekDiff] = useState(Math.abs(differenceInWeeks(now, end)));
    const [showRemainingInWeeks, setShowRemainingInWeeks] = useState(weeksDiff > 4);
    const [countdownDisabled, setCountdownDisabled] = useState(timeElapsed || showRemainingInWeeks);

    const [timeInterval, setTimeInterval] = useState<number | null>(countdownDisabled ? null : ONE_SECOND_IN_MS);
    const [duration, setDuration] = useState<Duration>(intervalToDuration({ start: now, end }));
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
        'months-short': t('options.common.time-remaining.months-short'),
    };

    useEffect(() => {
        if (onEnded && timeElapsed) {
            onEnded();
        }
    }, [onEnded, timeElapsed]);

    useMemo(() => {
        const today = Date.now();
        setTimeElapsed(today >= Number(end));
        setWeekDiff(Math.abs(differenceInWeeks(today, end)));
        setShowRemainingInWeeks(Math.abs(differenceInWeeks(today, end)) > 4);
        setCountdownDisabled(today >= Number(end) || Math.abs(differenceInWeeks(today, end)) > 4);
        setDuration(intervalToDuration({ start: today, end }));
    }, [end]);

    useInterval(() => {
        if (now <= Number(end)) {
            setDuration(intervalToDuration({ start: now, end }));
        } else {
            setTimeElapsed(true);
            setTimeInterval(null);
        }
    }, timeInterval);

    return (
        <Container fontSize={fontSize} duration={duration} showBorder={showBorder} zIndex={zIndex}>
            {timeElapsed
                ? t('options.common.time-remaining.ended')
                : showRemainingInWeeks
                ? `${weeksDiff} ${t('options.common.time-remaining.weeks')}`
                : showFullCounter
                ? formattedDurationFull(duration, dateTimeTranslationMap)
                : formattedDuration(duration, dateTimeTranslationMap)}
        </Container>
    );
};

const getColor = (duration: Duration, theme: ThemeInterface) => {
    if (duration.years || duration.months || duration.days) {
        return theme.textColor.primary;
    }
    if (duration.hours) {
        return theme.warning.textColor.primary;
    }
    if (duration.minutes && duration.minutes > 10) {
        if (duration.minutes > 10) {
            return theme.warning.textColor.secondary;
        }
    }
    return theme.error.textColor.primary;
};

const Container = styled.span<{ fontSize?: number; duration: Duration; showBorder?: boolean; zIndex?: number }>`
    font-size: ${(props) => props.fontSize || 12}px;
    @media (max-width: 512px) {
        font-size: ${(props) => props.fontSize || 10}px;
    }
    color: ${(props) => getColor(props.duration, props.theme)};
    border: ${(props) =>
        props.showBorder
            ? '1px solid ' +
              (getColor(props.duration, props.theme) === props.theme.error.textColor.primary
                  ? props.theme.error.textColor.primary
                  : 'transparent')
            : 'none'};
    padding: ${(props) => (props.showBorder ? '2px 12px 4px 12px' : '0')};
    border-radius: ${(props) => (props.showBorder ? '5px' : '0')};
    text-align: center;
    z-index: ${(props) => (props.zIndex !== undefined ? props.zIndex : 3)};
    white-space: pre;
`;

export default TimeRemaining;
