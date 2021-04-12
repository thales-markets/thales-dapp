import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { set0xReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { Menu } from 'semantic-ui-react';
import contractWrappers0xConnector from 'utils/contractWrappers0xConnector';
import OptionSideIcon from '../components/OptionSideIcon';
import TradeOptionsSide from './TradeOptionsSide';

const TradeOptions: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    useEffect(() => {
        dispatch(set0xReady(false));
        // TODO: For some reason, creating a new instance of contract wrappers is time-consuming and blocks rendering. Find a way to optimize this.
        contractWrappers0xConnector.setContractWrappers0x(isWalletConnected, networkId);
        dispatch(set0xReady(true));
    }, [networkId, isWalletConnected]);

    const tabContent: Array<{
        id: 'long' | 'short';
        name: string;
        color: 'red' | 'green';
    }> = useMemo(
        () => [
            {
                id: 'long',
                name: t('options.market.trade-options.trade-long-options-tab-title'),
                color: 'green',
            },
            {
                id: 'short',
                name: t('options.market.trade-options.trade-short-options-tab-title'),
                color: 'red',
            },
        ],
        [t]
    );

    const [activeTab, setActiveTab] = useState(tabContent[0]);

    return (
        <>
            <Menu tabular>
                {tabContent.map((tab) => (
                    <Menu.Item
                        key={tab.id}
                        onClick={() => setActiveTab(tab)}
                        active={tab.id === activeTab.id}
                        name={tab.id}
                        color={tab.color}
                    >
                        {tab.name}{' '}
                        <span style={{ marginLeft: 5, color: 'black' }}>
                            <OptionSideIcon side={tab.id} />
                        </span>
                    </Menu.Item>
                ))}
            </Menu>
            {activeTab.id === 'long' && <TradeOptionsSide optionSide="long" />}
            {activeTab.id === 'short' && <TradeOptionsSide optionSide="short" />}
        </>
    );
};

export default TradeOptions;
