import React from 'react';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import UserWalletExpanded from './UserWalletExpanded';
import PieChartUserBalance from 'components/Charts/PieChartUserBalance';
import PriceChart from 'components/Charts/PriceChart';
import LanguageCardSelector from 'components/LanguageSelector/v3/LanguageCardSelector';
import ThalesBalance from 'components/ThalesBalance/ThalesBalance';
import { getIsArbitrum, getIsBSC, getIsPolygon } from 'utils/network';

const MenuCardComponent: React.FC<{ showCard: boolean; setShowCard: any }> = ({ showCard, setShowCard }) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const showThalesBalance = !getIsPolygon(networkId) && !getIsArbitrum(networkId) && !getIsBSC(networkId);
    return (
        <MenuCard isVisible={showCard} className={'dark'}>
            <CloseIcon className="icon icon--x-sign" onClick={() => setShowCard(!showCard)} />
            <CardWrapper>
                <LogoContainer>
                    <ThalesLogo className="icon icon--logo" />
                </LogoContainer>
                <UserWalletExpanded />
                <Container>
                    {isWalletConnected && <PieChartUserBalance />}
                    {isWalletConnected && showThalesBalance && <ThalesBalance />}
                </Container>

                <PriceChart currencyKey={'THALES'} showHeading={true} />
                <LanguageCardSelector />
            </CardWrapper>
        </MenuCard>
    );
};

const MenuCard = styled.div<{ isVisible: boolean }>`
    display: ${(props) => (props.isVisible ? 'block' : 'none')};
    position: absolute;
    max-width: 280px;
    right: 35px;
    max-height: 95vh;
    overflow-y: auto;
    top: 40px;
    border: 1px solid var(--color-highlight);
    box-sizing: border-box;
    border-radius: 15px;
    z-index: 1000;
    background-color: ${(props) => props.theme.background.primary};
    --background: var(--color-primary);
    --icon-color: #f7f7f7;
    --shadow-color: 'var(--color-highlight)';
    @media (max-width: 1024px) {
        width: 100%;
        max-width: 100%;
        max-height: unset;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        border-radius: 0;
        border: none;
        position: fixed;
    }
    box-shadow: var(--shadow);
`;

const Container = styled.div`
    display: contents;
    @media (max-width: 1024px) {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        & > div {
            width: 50%;
        }
    }
`;

const CardWrapper = styled.div`
    padding: 24px;
    max-width: 600px;
    margin: auto;

    @media (max-width: 568px) {
        padding: 24px 12px;
    }
`;

const CloseIcon = styled.i`
    position: absolute;
    top: 22px;
    right: 19px;
    font-size: 16px;
    padding: 4px;
    box-sizing: content-box;
    cursor: pointer;
    color: ${(props) => props.theme.textColor.primary};
`;

const LogoContainer = styled.div`
    line-height: 30px;
    margin: 14px auto 16px auto;
    width: 100%;
    text-align: center;
    @media (max-width: 1024px) {
        margin: 0 0 10px 0px;
    }
`;

const ThalesLogo = styled.i`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 140px;
`;

export default MenuCardComponent;
