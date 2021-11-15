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

const RoyaleHeader: React.FC = () => {
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

    console.log('ignore', balance);

    return (
        <Header>
            <ThalesLogo src={logo} />
            <InfoWrapper>
                <UserWrapper>
                    <UserAvatar src={avatar} />
                    <UserText>{truncateAddress(walletAddress as any, 5, 5)}</UserText>
                    <UserText> {balance} Eth </UserText>
                </UserWrapper>
                <UtilWrapper>
                    <RoyaleLogo src={royaleLogo} />
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
const UserWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #64d9fe;
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
    color: #64d9fe;

    margin: 0 4px;

    &:last-child {
        border-left: 1px solid #64d9fe;
        padding-left: 8px;
    }
`;

export default RoyaleHeader;
