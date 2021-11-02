import ROUTES from 'constants/routes';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Background, FlexDivCentered, Wrapper, Image, Text } from 'theme/common';
import MarketHeader from '../Home/MarketHeader';
import BattleRoyale from './components/BattleRoyale';
import Scoreboard from './components/Scoreboard';
import { getThalesRoyalData, ThalesRoyalData } from './getThalesRoyalData';
import leftArrow from 'assets/images/royale/left.svg';
import rightArrow from 'assets/images/royale/right.svg';

const ThalesRoyal: React.FC = () => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [thalesRoyalData, setData] = useState<undefined | ThalesRoyalData>(undefined);
    const [showBattle, setShowBattle] = useState(false);

    useMemo(async () => {
        if (walletAddress && networkId === 69) {
            setData(await getThalesRoyalData());
        }
    }, [walletAddress, networkId]);

    return (
        <Background>
            <Wrapper>
                <MarketHeader route={ROUTES.Options.Royal} />
                {!showBattle && thalesRoyalData && <Scoreboard royaleData={thalesRoyalData}></Scoreboard>}
                {showBattle && thalesRoyalData && <BattleRoyale royaleData={thalesRoyalData}></BattleRoyale>}
                <Footer>
                    <Nav>
                        <NavButton className={!showBattle ? 'disabled' : ''} onClick={() => setShowBattle(false)}>
                            <Image src={leftArrow} />
                            <Text> Scoreboard </Text>
                        </NavButton>
                        <NavButton className={showBattle ? 'disabled' : ''} onClick={() => setShowBattle(true)}>
                            <Text> Battle </Text>
                            <Image src={rightArrow} />
                        </NavButton>
                    </Nav>
                </Footer>
            </Wrapper>
        </Background>
    );
};

const Footer = styled.div`
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-between;
`;

const Nav = styled.div`
    display: flex;
    justify-content: space-between;
    width: 300px;
`;

const NavButton = styled(FlexDivCentered)`
    justify-content: space-around;
    cursor: pointer;
    font-family: Sansation Light;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 22px;
    color: #64d9fe;
    &.disabled {
        cursor: not-allowed;
        opacity: 0.2;
    }
    img {
        margin: 0 10px;
    }
`;

export default ThalesRoyal;
