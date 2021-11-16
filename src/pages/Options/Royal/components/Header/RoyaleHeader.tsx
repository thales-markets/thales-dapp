import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { getEthBalance } from '../../getThalesRoyalData';
import avatar from 'assets/images/royale/avatar.svg';
import logo from 'assets/images/royale/logo.svg';
import royaleLogo from 'assets/images/royale/royale-logo.svg';
import { truncateAddress } from 'utils/formatters/string';
import { Theme } from '../../ThalesRoyal';

type RoyaleHeaderInput = {
    theme: Theme;
    setTheme: (data: any) => void;
};

const RoyaleHeader: React.FC<RoyaleHeaderInput> = ({ theme, setTheme }) => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        if (walletAddress) {
            getEthBalance(walletAddress).then((balance: any) => {
                console.log(balance);
                setBalance(balance);
            });
        }
        return undefined;
    }, [walletAddress]);

    return (
        <Header>
            <ThalesLogo src={logo} />
            <InfoWrapper>
                <BorderedWrapper>
                    <UserAvatar src={avatar} />
                    <UserText>{truncateAddress(walletAddress as any, 5, 5)}</UserText>
                    <UserText> {balance} Eth </UserText>
                </BorderedWrapper>
                <UtilWrapper>
                    <RoyaleLogo src={royaleLogo} />
                    <BorderedWrapper
                        style={{
                            flexDirection: theme === Theme.Light ? 'row' : 'row-reverse',
                            cursor: 'pointer',
                            maxWidth: 70,
                        }}
                        onClick={setTheme.bind(this, theme === Theme.Light ? Theme.Dark : Theme.Light)}
                    >
                        <ThemeSelector> {theme === Theme.Light ? 'B' : 'G'}</ThemeSelector>
                        <ThemeText>Theme</ThemeText>
                    </BorderedWrapper>
                </UtilWrapper>
            </InfoWrapper>
        </Header>
    );
};

const Header = styled.div`
    position: relative;
    padding-top: 35px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

const ThemeSelector = styled.div`
    background: var(--color);
    color: var(--color-wrapper);
    border-radius: 50%;
    font-size: 18px;
    line-height: 20px;
    font-weight: bold;
    width: 20px;
    height: 20px;
    text-align: center;
`;

const ThemeText = styled.p`
    font-family: SensationLight !important;
    font-size: 10px;
    color: var(--color);
    text-transform: uppercase;
    letter-spacing: -0.4px;
    font-weight: 300;
`;

const UtilWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex: 1;
    align-items: center;
    width: 100%;
    margin-top: 8px;
`;

const ThalesLogo = styled.img`
    height: 30px;
    object-fit: contain;
`;
const InfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;
const RoyaleLogo = styled.img`
    height: 25px;
    object-fit: contain;
`;
const BorderedWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--color);
    box-sizing: border-box;
    border-radius: 20px;
    height: 28px;
    padding: 4px 6px;
    flex: 1;
`;
const UserAvatar = styled.img`
    height: 19px;
    object-fit: contain;
`;

const UserText = styled.p`
    font-family: Sansation !important;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    color: var(--color);

    margin: 0 4px;

    &:last-child {
        border-left: 1px solid var(--color);
        padding-left: 8px;
    }
`;

export default RoyaleHeader;
