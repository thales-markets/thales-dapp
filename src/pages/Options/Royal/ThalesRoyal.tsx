import ROUTES from 'constants/routes';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Background, FlexDivCentered, Wrapper, Text } from 'theme/common';
import MarketHeader from '../Home/MarketHeader';
import BattleRoyale from './components/BattleRoyale';
import Scoreboard from './components/Scoreboard';
import { getEthPrice, getThalesRoyalData, ThalesRoyalData } from './getThalesRoyalData';
import leftArrow from 'assets/images/royale/left.svg';
import rightArrow from 'assets/images/royale/right.svg';
import useInterval from '../../../hooks/useInterval';
import { useTranslation } from 'react-i18next';

const ThalesRoyal: React.FC = () => {
    const { t } = useTranslation();

    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [thalesRoyalData, setData] = useState<undefined | ThalesRoyalData>(undefined);
    const [showBattle, setShowBattle] = useState<boolean>(false);
    const [fetchNewData, setFetchNewData] = useState<number>(Date.now());
    const [ethPrice, setEthPrice] = useState<string | undefined>('');

    useMemo(async () => {
        if (walletAddress && networkId === 69) {
            setData(await getThalesRoyalData(walletAddress));
            setEthPrice(await getEthPrice());
        }
    }, [walletAddress, networkId, fetchNewData]);

    useInterval(async () => {
        setEthPrice(await getEthPrice());
    }, 10000);

    return (
        <Background>
            <Wrapper style={{ position: 'relative' }}>
                <MarketHeader route={ROUTES.Options.Royal} />
                {!showBattle && thalesRoyalData && <Scoreboard royaleData={thalesRoyalData}></Scoreboard>}
                {showBattle && thalesRoyalData && (
                    <BattleRoyale royaleData={thalesRoyalData} setFetchNewData={setFetchNewData}></BattleRoyale>
                )}
            </Wrapper>
            <Footer>
                <Nav>
                    <NavButton className={!showBattle ? 'disabled' : ''} onClick={() => setShowBattle(false)}>
                        <img src={leftArrow} />
                        <Text> Scoreboard </Text>
                    </NavButton>
                    <NavButton className={showBattle ? 'disabled' : ''} onClick={() => setShowBattle(true)}>
                        <Text> Battle </Text>
                        <img src={rightArrow} />
                    </NavButton>
                </Nav>

                <InfoSection>
                    <div>
                        <span>ETH {t('options.royale.footer.price')}:</span>
                        <span>{ethPrice}$</span>
                    </div>
                    <div>
                        <span>{t('options.royale.footer.reward-per-player')}:</span>
                        <span>10000 THALES</span>
                    </div>
                    <div>
                        <span>{t('options.royale.footer.players-alive')}:</span>
                        <span>1/2</span>
                    </div>
                </InfoSection>
            </Footer>
        </Background>
    );
};

const Footer = styled.div`
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 50px 120px;
    align-items: flex-end;
`;

const Nav = styled.div`
    display: flex;
    justify-content: space-between;
    width: 275px;
`;

const NavButton = styled(FlexDivCentered)`
    justify-content: space-around;
    cursor: pointer;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 22px;
    color: #64d9fe;
    > * {
        font-family: Sansation Light !important;
    }
    &.disabled {
        cursor: not-allowed;
        opacity: 0.2;
    }
    img {
        margin: 0 10px;
    }
`;

const InfoSection = styled.div`
    color: #64d9fe;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 30px;
    > * {
        > * {
            font-family: Sansation Light !important;
            &:nth-child(1) {
                padding-right: 7px;
            }
            &:nth-child(2) {
                font-weight: bold;
            }
        }
    }
`;

export default ThalesRoyal;
