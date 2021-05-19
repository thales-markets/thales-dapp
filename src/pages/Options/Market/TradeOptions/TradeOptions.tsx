import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'semantic-ui-react';
import { OptionSide } from 'types/options';
import TokenSwap from './TokenSwap';
import PlaceOrder from './PlaceOrder';
import MarketWidgetContent from '../components/MarketWidget/MarketWidgetContent';
import { MarketWidgetKey } from 'constants/ui';
import MarketWidgetHeader from '../components/MarketWidget/MarketWidgetHeader';

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
                <Menu tabular>
                    {tabContent.map((tab) => (
                        <Menu.Item
                            key={tab.id}
                            onClick={() => setActiveTab(tab)}
                            active={tab.id === activeTab.id}
                            name={tab.id}
                        >
                            {tab.name}
                        </Menu.Item>
                    ))}
                </Menu>
                {activeTab.id === 'market' && <TokenSwap optionSide={optionSide} />}
                {activeTab.id === 'limit' && <PlaceOrder optionSide={optionSide} />}
            </MarketWidgetContent>
        </>
    );
};

export default TradeOptions;
