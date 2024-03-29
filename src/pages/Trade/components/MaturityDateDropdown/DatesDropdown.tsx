import useMarketsCountQuery from 'queries/options/useMarketsCountQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OutsideClickHandler from 'react-outside-click-handler';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import styled from 'styled-components';
import { formatShortDateWithTime } from 'thales-utils';
import { RootState } from 'types/ui';
import { areDatesEqual } from 'utils/ui';

type AssetDropdownProps = {
    date: number | undefined;
    setDate: React.Dispatch<React.SetStateAction<number | undefined>>;
    allDates: number[];
    currencyKey: string;
};

const DatesDropdown: React.FC<AssetDropdownProps> = ({ date, setDate, allDates, currencyKey }) => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const [open, setOpen] = useState(false);

    const marketsCountQuery = useMarketsCountQuery(networkId, {
        enabled: isAppReady,
    });

    const marketsQueryData = useMemo(() => {
        if (marketsCountQuery.isSuccess && marketsCountQuery.data) return marketsCountQuery.data;
        return [];
    }, [marketsCountQuery.data, marketsCountQuery.isSuccess]);

    const assetsCountData = marketsQueryData.find((item) => item.asset == currencyKey);

    // hooks
    useEffect(() => {
        if (allDates[0]) setDate(allDates[0]);
    }, [allDates, setDate]);

    const countDisplay = (date: number | undefined, removeMarketsLabel?: boolean) => {
        const countData = assetsCountData?.byMaturity.find((item) => areDatesEqual(date, item.maturity));

        if (countData) return `(${countData.count}${!removeMarketsLabel ? ` ${t('markets.markets')}` : ''})`;
        return undefined;
    };

    return (
        <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
            <Wrapper>
                <Container onClick={() => setOpen(!open)} isClickable={allDates.length > 1}>
                    <DatePrint onClick={() => date && setDate(date)}>
                        {date ? formatShortDateWithTime(date) : 'N/A'}
                        <MarketsCount>{countDisplay(date)}</MarketsCount>
                    </DatePrint>
                    {allDates.length > 1 && <Icon className={open ? `icon icon--caret-up` : `icon icon--caret-down`} />}
                </Container>
                {open && allDates.length > 1 && (
                    <Dropdown onClick={() => setOpen(!open)}>
                        {allDates.map((_date, index) => (
                            <DateContainer key={index}>
                                <DatePrint onClick={() => setDate(_date)}>
                                    {formatShortDateWithTime(_date)}
                                    {countDisplay(_date, true) && (
                                        <MarketsCount>{countDisplay(_date, true)}</MarketsCount>
                                    )}
                                </DatePrint>
                            </DateContainer>
                        ))}
                    </Dropdown>
                )}
            </Wrapper>
        </OutsideClickHandler>
    );
};

const Wrapper = styled.div`
    position: relative;
    z-index: 1;
    max-height: 23px;
    height: 23px;
`;

const Icon = styled.i`
    font-size: 12px;
    color: ${(props) => props.theme.textColor.primary};
`;

const Container = styled.div<{ isClickable?: boolean }>`
    width: 100%;
    max-height: 23px;
    padding: 5px 15px;
    height: 23px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    cursor: ${(props) => (props.isClickable ? 'pointer' : 'default')};
`;

const Dropdown = styled.div`
    margin-top: 5px;
    padding: 5px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    cursor: pointer;
    z-index: 100;
    text-align: start;
`;

const DatePrint = styled.p`
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    width: 100%;
    font-size: 13px;
    line-height: 100%;
    margin-right: 5px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
`;

const DateContainer = styled.div`
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    &:hover {
        background: ${(props) => props.theme.background.primary};
    }
    width: 100%;
    padding: 5px 10px;
`;

const MarketsCount = styled.span`
    margin-left: 5px;
    font-weight: 400;
`;

export default DatesDropdown;
