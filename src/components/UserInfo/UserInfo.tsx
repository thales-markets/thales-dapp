import React, { useState } from 'react';
import { SYNTHS_MAP } from 'constants/currency';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetwork, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumnCentered, Image } from 'theme/common';
import { getCurrencyKeyBalance } from 'utils/balances';
import { truncateAddress } from 'utils/formatters/string';
import avatar from 'assets/images/avatar.svg';
import UserInfoModal from './UserInfoModal';
import { formatCurrencyWithKey } from 'utils/formatters/number';

const UserInfo: React.FC = () => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const network = useSelector((state: RootState) => getNetwork(state));
    const [open, setOpen] = useState(false);

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, network.networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    return (
        <>
            <UserInfoWrapper className="dapp-header__userInfo" onClick={setOpen.bind(this, true)}>
                <EthBalance>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)}</EthBalance>
                <NetworkWrapper>
                    <AddressWrapper>
                        <p>{truncateAddress(walletAddress)}</p>
                        <p>{network.networkName}</p>
                    </AddressWrapper>
                    <Image style={{ width: '18px', height: '18px', marginRight: '20px' }} src={avatar}></Image>
                </NetworkWrapper>
            </UserInfoWrapper>
            <UserInfoModal
                walletAddress={walletAddress}
                network={network.networkName}
                open={open}
                handleClose={setOpen.bind(this, false)}
            ></UserInfoModal>
        </>
    );
};

const UserInfoWrapper = styled(FlexDiv)`
    height: 40px;
    width: 260px;
    background: #0a2e66;
    border-radius: 30px;
    align-items: center;
    cursor: pointer;
`;

const EthBalance = styled.p`
    margin: 14px 10px 14px 20px !important;
    flex: 3;
    background: #0a2e66;
    border-radius: 30px;
    font-weight: bold;
    font-size: 13px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.4px;
    color: #f6f6fe;
`;

const NetworkWrapper = styled(FlexDiv)`
    flex: 9;
    background: #3936c7;
    border-radius: 32px;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

const AddressWrapper = styled(FlexDivColumnCentered)`
    align-items: center;
    p:first-child {
        margin: 0 10px 10px 28px !important;
        font-weight: bold;
        font-size: 13px;
        line-height: 24px;
        letter-spacing: 0.4px;
        color: #f6f6fe;
    }
    p:last-child {
        margin-top: -16px;
        margin-left: 20px;
        text-transform: capitalize;
        font-weight: bold;
        font-size: 9px;
        line-height: 14px;
        text-align: center;
        letter-spacing: 0.4px;
        color: #f6f6fe;
    }
`;

export default UserInfo;
