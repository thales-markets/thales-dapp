import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OptionSide } from 'types/options';
import TokenSwap from './TokenSwap';
import PlaceOrder from './PlaceOrder';
import MarketWidgetContent from '../components/MarketWidget/MarketWidgetContent';
import { MarketWidgetKey } from 'constants/ui';
import MarketWidgetHeader from '../components/MarketWidget/MarketWidgetHeader';
import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';

type TradeOptionsProps = {
    optionSide: OptionSide;
};

const TradeOptions: React.FC<TradeOptionsProps> = ({ optionSide }) => {
    const { t } = useTranslation();
    const tabContent: Array<{
        id: 'market' | 'limit';
        name: string;
    }> = useMemo(
        () => [
            {
                id: 'limit',
                name: t('options.market.trade-options.limit-tab-title'),
            },
            {
                id: 'market',
                name: t('options.market.trade-options.market-tab-title'),
            },
        ],
        [t]
    );

    const [activeTab, setActiveTab] = useState(tabContent[0]);

    return (
        <>
            <MarketWidgetHeader widgetKey={MarketWidgetKey.TRADE}></MarketWidgetHeader>
            <MarketWidgetContent>
                <Container>
                    <FilterContainer>
                        {tabContent.map((tab) => (
                            <FilterButton
                                key={tab.id}
                                onClick={() => setActiveTab(tab)}
                                className={tab.id === activeTab.id ? 'selected' : ''}
                                name={tab.id}
                            >
                                {tab.name}
                            </FilterButton>
                        ))}
                    </FilterContainer>
                    {activeTab.id === 'market' && <TokenSwap optionSide={optionSide} />}
                    {activeTab.id === 'limit' && <PlaceOrder optionSide={optionSide} />}
                </Container>
            </MarketWidgetContent>
        </>
    );
};

const Container = styled(FlexDivColumn)``;

const FilterContainer = styled.div`
    &:first-child {
        margin-left: 10px;
    }
`;

const FilterButton = styled.button`
    background: transparent;
    border: 2px solid rgba(1, 38, 81, 0.5);
    border-radius: 20px;
    min-height: 40px;
    cursor: pointer;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.5px;
    color: #f6f6fe;
    width: 139px;
    margin: 14px 9px;
    &.selected,
    &:hover {
        background: rgba(1, 38, 81, 0.5);
        border: 2px solid #04045a;
        border-radius: 20px;
        color: #04045a;
    }
`;

export default TradeOptions;
