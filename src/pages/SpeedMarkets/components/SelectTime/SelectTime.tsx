import Button from 'components/Button';
import NumericInput from 'components/fields/NumericInput/NumericInput';
import TimeInput from 'components/fields/TimeInput';
import {
    hoursToSeconds,
    millisecondsToSeconds,
    minutesToSeconds,
    secondsToHours,
    secondsToMilliseconds,
    secondsToMinutes,
} from 'date-fns';
import useInterval from 'hooks/useInterval';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { useTheme } from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered, FlexDivRow } from 'styles/common';
import { AmmSpeedMarketsLimits } from 'types/options';
import { ThemeInterface } from 'types/ui';

type SelectTimeProps = {
    selectedDeltaSec: number;
    onDeltaChange: React.Dispatch<number>;
    onExactTimeChange: React.Dispatch<number>;
    ammSpeedMarketsLimits: AmmSpeedMarketsLimits | null;
    isResetTriggered: boolean;
};

const SelectTime: React.FC<SelectTimeProps> = ({
    selectedDeltaSec,
    onDeltaChange,
    onExactTimeChange,
    ammSpeedMarketsLimits,
    isResetTriggered,
}) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const [isDeltaSelected, setIsDeltaSelected] = useState(true); // false is when exact time is selected
    const [customDeltaTime, setCustomDeltaTime] = useState<string | number>('');
    const [isDeltaMinutesSelected, setIsDeltaMinutesSelected] = useState(true); // false is when hours is selected

    const DEFAULT_HOURS = '12';
    const DEFAULT_MINUTES = '00';
    const [exactTimeHours, setExactTimeHours] = useState(DEFAULT_HOURS);
    const [exactTimeMinutes, setExactTimeMinutes] = useState(DEFAULT_MINUTES);
    const [isAM, setIsAM] = useState(true); // false is when it is PM

    const [errorMessage, setErrorMessage] = useState('');

    const deltaTimesMinutes: number[] = useMemo(() => {
        const times = [];
        if (ammSpeedMarketsLimits && secondsToHours(ammSpeedMarketsLimits?.minimalTimeToMaturity) === 0) {
            times.push(secondsToMinutes(ammSpeedMarketsLimits.minimalTimeToMaturity));
            setIsDeltaMinutesSelected(true);
        } else {
            setIsDeltaMinutesSelected(false);
        }

        return times;
    }, [ammSpeedMarketsLimits]);

    const deltaTimesHours: number[] = useMemo(() => {
        const times = [];
        if (ammSpeedMarketsLimits) {
            const minHours = secondsToHours(ammSpeedMarketsLimits.minimalTimeToMaturity);
            const max = secondsToHours(ammSpeedMarketsLimits.maximalTimeToMaturity);

            if (minHours !== 0) {
                // no minutes
                times.push(minHours);
                times.push(minHours * 4);
            } else {
                times.push(1); // one hour
            }

            times.push(max / 2);
            times.push(max);
        }

        return times;
    }, [ammSpeedMarketsLimits]);

    const isValidExactTime = useCallback(
        (exactTime: Date | undefined) => {
            if (!isDeltaSelected) {
                if (
                    exactTime &&
                    ammSpeedMarketsLimits &&
                    exactTime.getTime() - Date.now() <
                        secondsToMilliseconds(ammSpeedMarketsLimits?.minimalTimeToMaturity)
                ) {
                    const minimalTimeHours = secondsToHours(ammSpeedMarketsLimits?.minimalTimeToMaturity || 0);
                    setErrorMessage(
                        t('speed-markets.errors.min-maturity-date', {
                            minTime:
                                minimalTimeHours === 0
                                    ? secondsToMinutes(ammSpeedMarketsLimits?.minimalTimeToMaturity || 0)
                                    : minimalTimeHours,
                            timeUnit:
                                minimalTimeHours === 0
                                    ? t('common.time-remaining.minutes')
                                    : minimalTimeHours === 1
                                    ? t('common.time-remaining.hour')
                                    : t('common.time-remaining.hours'),
                        })
                    );
                    return false;
                }

                setErrorMessage('');
                return true;
            }
        },
        [ammSpeedMarketsLimits, isDeltaSelected, t]
    );

    const getExactTime = useCallback(() => {
        if (!isDeltaSelected) {
            const exactTime = new Date();
            exactTime.setHours(
                isAM
                    ? Number(exactTimeHours) === 12
                        ? 0
                        : Number(exactTimeHours)
                    : Number(exactTimeHours) === 12
                    ? 12
                    : Number(exactTimeHours) + 12
            );
            exactTime.setMinutes(Number(exactTimeMinutes));
            exactTime.setSeconds(0);
            exactTime.setMilliseconds(0);
            if (exactTime.getTime() < Date.now()) {
                // if in the past move it for one day
                exactTime.setDate(exactTime.getDate() + 1);
            }
            return exactTime;
        }
    }, [isDeltaSelected, isAM, exactTimeHours, exactTimeMinutes]);

    // Exact time handler
    useEffect(() => {
        if (!isDeltaSelected) {
            const exactTime = getExactTime();

            if (!isValidExactTime(exactTime)) {
                return;
            }

            if (exactTime) {
                const exactTimeSec = millisecondsToSeconds(exactTime.getTime());
                onExactTimeChange(exactTimeSec);
            }
        }
    }, [
        ammSpeedMarketsLimits,
        isDeltaSelected,
        isAM,
        exactTimeHours,
        exactTimeMinutes,
        getExactTime,
        isValidExactTime,
        onExactTimeChange,
    ]);

    useInterval(() => isValidExactTime(getExactTime()), secondsToMilliseconds(10));

    // Validations for delta time
    useEffect(() => {
        if (isDeltaSelected) {
            if (ammSpeedMarketsLimits && customDeltaTime !== '') {
                const customDeltaTimeSec = isDeltaMinutesSelected
                    ? minutesToSeconds(Number(customDeltaTime))
                    : hoursToSeconds(Number(customDeltaTime));

                if (customDeltaTimeSec < ammSpeedMarketsLimits.minimalTimeToMaturity) {
                    const minimalTimeHours = secondsToHours(ammSpeedMarketsLimits?.minimalTimeToMaturity || 0);
                    setErrorMessage(
                        t('speed-markets.errors.min-time', {
                            minTime:
                                isDeltaMinutesSelected || minimalTimeHours === 0
                                    ? secondsToMinutes(ammSpeedMarketsLimits?.minimalTimeToMaturity || 0)
                                    : minimalTimeHours,
                            timeUnit:
                                isDeltaMinutesSelected || minimalTimeHours === 0
                                    ? t('common.time-remaining.minutes')
                                    : t('common.time-remaining.hours'),
                        })
                    );
                    return;
                } else if (customDeltaTimeSec > ammSpeedMarketsLimits.maximalTimeToMaturity) {
                    setErrorMessage(
                        t('speed-markets.errors.max-time', {
                            maxTime: isDeltaMinutesSelected
                                ? secondsToMinutes(ammSpeedMarketsLimits?.maximalTimeToMaturity || 0)
                                : secondsToHours(ammSpeedMarketsLimits?.maximalTimeToMaturity || 0),
                            timeUnit: isDeltaMinutesSelected
                                ? t('common.time-remaining.minutes')
                                : t('common.time-remaining.hours'),
                        })
                    );
                    return;
                }
            }

            setErrorMessage('');
        }
    }, [ammSpeedMarketsLimits, customDeltaTime, isDeltaMinutesSelected, t, isDeltaSelected]);

    const resetData = useCallback(() => {
        setIsDeltaSelected(true);
        setIsDeltaMinutesSelected(!!deltaTimesMinutes.length);
        setCustomDeltaTime('');
        onDeltaChange(0);

        setIsAM(true);
        setExactTimeHours(DEFAULT_HOURS);
        setExactTimeMinutes(DEFAULT_MINUTES);
        onExactTimeChange(0);
    }, [onDeltaChange, onExactTimeChange, deltaTimesMinutes]);

    // Reset inputs
    useEffect(() => {
        if (!isWalletConnected || isResetTriggered) {
            resetData();
        }
    }, [isWalletConnected, resetData, isResetTriggered]);

    const onDeltaTimeClickHandler = (deltaHours: number, deltaMinutes: number) => {
        setIsDeltaSelected(true);
        setCustomDeltaTime(deltaHours ? deltaHours : deltaMinutes);
        setIsDeltaMinutesSelected(deltaHours ? false : true);
        onDeltaChange(deltaHours ? hoursToSeconds(deltaHours) : minutesToSeconds(deltaMinutes));
        onExactTimeChange(0);
    };

    const onDeltaTimeInputChange = (value: number | string) => {
        setCustomDeltaTime(value);
        onDeltaChange(isDeltaMinutesSelected ? minutesToSeconds(Number(value)) : hoursToSeconds(Number(value)));
        onExactTimeChange(0);
    };

    const onMinutesButtonClikHandler = () => {
        if (!isDeltaMinutesSelected) {
            setIsDeltaMinutesSelected(true);
            onDeltaChange(minutesToSeconds(Number(customDeltaTime)));
        }
    };

    const onHoursButtonClikHandler = () => {
        if (isDeltaMinutesSelected) {
            setIsDeltaMinutesSelected(false);
            onDeltaChange(hoursToSeconds(Number(customDeltaTime)));
        }
    };

    const onSwitchTimeClickHandler = () => {
        setIsDeltaSelected(!isDeltaSelected);
        setCustomDeltaTime('');
        onDeltaChange(0);
        onExactTimeChange(0);
    };

    return (
        <Container>
            <Row>
                {deltaTimesMinutes.map((deltaMinutes, index) => (
                    <DeltaTime
                        key={'minutes' + index}
                        isSelected={isDeltaSelected && selectedDeltaSec === minutesToSeconds(deltaMinutes)}
                        onClick={() => onDeltaTimeClickHandler(0, deltaMinutes)}
                    >{`${deltaMinutes}m`}</DeltaTime>
                ))}
                {deltaTimesHours.map((deltaHours, index) => (
                    <DeltaTime
                        key={'hours' + index}
                        isSelected={isDeltaSelected && selectedDeltaSec === hoursToSeconds(deltaHours)}
                        onClick={() => onDeltaTimeClickHandler(deltaHours, 0)}
                    >{`${deltaHours}h`}</DeltaTime>
                ))}
                <Time isSelected={!isDeltaSelected} onClick={onSwitchTimeClickHandler}>
                    <Icon className="icon icon--clock" />
                </Time>
            </Row>

            {isDeltaSelected ? (
                <Row>
                    <InputWrapper>
                        <NumericInput
                            value={customDeltaTime}
                            placeholder={isDeltaMinutesSelected ? t('common.enter-minutes') : t('common.enter-hours')}
                            onChange={(_, value) => onDeltaTimeInputChange(value)}
                            showValidation={!!errorMessage}
                            validationMessage={errorMessage}
                            margin="0"
                            inputPadding="5px 40px 5px 10px"
                        />
                    </InputWrapper>
                    <Column>
                        <Button
                            height="13px"
                            width="60px"
                            padding="0 29px"
                            fontSize="13px"
                            backgroundColor={!isDeltaMinutesSelected ? theme.button.background.tertiary : undefined}
                            borderColor={!isDeltaMinutesSelected ? theme.button.background.tertiary : undefined}
                            textColor={!isDeltaMinutesSelected ? theme.button.textColor.tertiary : undefined}
                            additionalStyles={{ borderRadius: '4px' }}
                            onClick={onMinutesButtonClikHandler}
                        >
                            {t('common.time-remaining.minutes')}
                        </Button>
                        <Button
                            height="13px"
                            width="60px"
                            padding="0 29px"
                            fontSize="13px"
                            backgroundColor={isDeltaMinutesSelected ? theme.button.background.tertiary : undefined}
                            borderColor={isDeltaMinutesSelected ? theme.button.background.tertiary : undefined}
                            textColor={isDeltaMinutesSelected ? theme.button.textColor.tertiary : undefined}
                            additionalStyles={{ borderRadius: '4px' }}
                            onClick={onHoursButtonClikHandler}
                        >
                            {t('common.time-remaining.hours')}
                        </Button>
                    </Column>
                </Row>
            ) : (
                <Row>
                    <TimeInput
                        value={exactTimeHours}
                        onChange={(_, value) => setExactTimeHours(value)}
                        showValidation={!!errorMessage}
                        validationMessage={errorMessage}
                        min="1"
                        max="12"
                        margin="0"
                        inputPadding="5px 10px"
                        validationMargin={isMobile ? '-10px 0 0 5px' : '-10px 0 0 150px'}
                    />
                    <TimeSeparator>:</TimeSeparator>
                    <TimeInput
                        value={exactTimeMinutes}
                        onChange={(_, value) => setExactTimeMinutes(value)}
                        showValidation={!!errorMessage}
                        min="0"
                        max="59"
                        margin="0"
                        inputPadding="5px 10px"
                    />
                    <Column>
                        <Button
                            height="13px"
                            width="60px"
                            padding="0 29px"
                            fontSize="13px"
                            backgroundColor={!isAM ? theme.button.background.tertiary : undefined}
                            borderColor={!isAM ? theme.button.background.tertiary : undefined}
                            textColor={!isAM ? theme.button.textColor.tertiary : undefined}
                            additionalStyles={{ borderRadius: '4px' }}
                            onClick={() => setIsAM(true)}
                        >
                            {'AM'}
                        </Button>
                        <Button
                            height="13px"
                            width="60px"
                            padding="0 29px"
                            fontSize="13px"
                            backgroundColor={isAM ? theme.button.background.tertiary : undefined}
                            borderColor={isAM ? theme.button.background.tertiary : undefined}
                            textColor={isAM ? theme.button.textColor.tertiary : undefined}
                            additionalStyles={{ borderRadius: '4px' }}
                            onClick={() => setIsAM(false)}
                        >
                            {'PM'}
                        </Button>
                    </Column>
                </Row>
            )}
        </Container>
    );
};

const Container = styled.div``;

const Row = styled(FlexDivRow)`
    :first-child {
        margin-bottom: 11px;
    }
`;

const Column = styled(FlexDivColumnCentered)`
    justify-content: space-between;
    margin-left: 10px;
`;

const InputWrapper = styled.div`
    width: 100%;
`;

const Time = styled(FlexDivCentered)<{ isSelected: boolean }>`
    width: 60px;
    height: 31px;
    border-radius: 8px;
    background: ${(props) =>
        props.isSelected ? props.theme.button.background.primary : props.theme.button.background.tertiary};
    color: ${(props) =>
        props.isSelected ? props.theme.button.textColor.primary : props.theme.button.textColor.secondary};
    cursor: pointer;
    font-weight: ${(props) => (props.isSelected ? '600' : '300')};
`;

const DeltaTime = styled(Time)`
    font-weight: 600;
    font-size: 13px;
    line-height: 90%;
    padding-left: 1px;
`;

const Icon = styled.i`
    font-size: 20px;
    line-height: 100%;
    color: inherit;
`;

const TimeSeparator = styled(FlexDivCentered)`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 16px;
    font-weight: 500;
    margin: 0 7px;
`;

export default SelectTime;
