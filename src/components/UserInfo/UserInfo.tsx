import React, { useEffect, useState } from 'react';
import { SYNTHS_MAP, THALES_CURRENCY } from 'constants/currency';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetwork, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumnCentered } from 'theme/common';
import { getCurrencyKeyBalance } from 'utils/balances';
import { truncateAddress } from 'utils/formatters/string';
import UserInfoModal from './UserInfoModal';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { ReactComponent as InfoIcon } from '../../assets/images/info.svg';
import ThalesBalanceTooltip from './ThalesBalanceTooltip';
import { withStyles } from '@material-ui/core';
import MaterialTooltip from '@material-ui/core/Tooltip';
import { getIsOVM } from 'utils/network';
import useThalesBalanceQuery from 'queries/walletBalances/useThalesBalanceQuery';
import useStakingThalesQuery from '../../queries/staking/useStakingThalesQuery';
import useEscrowThalesQuery from '../../queries/staking/useEscrowThalesQuery';
import makeBlockie from 'ethereum-blockies-base64';

const UserInfo: React.FC = () => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const network = useSelector((state: RootState) => getNetwork(state));
    const [open, setOpen] = useState(false);
    const [thalesTotalBalance, setThalesTotalBalance] = useState(0);
    const isL2 = getIsOVM(network.networkId);

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, network.networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;
    const iconSize = thalesTotalBalance ? '20' : '15';
    const truncateAddressNumberOfCharacters = window.innerWidth < 768 ? 2 : 5;
    const hideAddress = window.innerWidth < 320;

    const [thalesStaked, setThalesStaked] = useState(0);
    const [escrowedBalance, setEscrowedBalance] = useState(0);
    const [thalesBalance, setThalesBalance] = useState(0);

    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, network.networkId, {
        enabled: isAppReady && isWalletConnected && isL2,
    });

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, network.networkId, {
        enabled: isAppReady && isWalletConnected && isL2,
    });

    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, network.networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (stakingThalesQuery.isSuccess && stakingThalesQuery.data) {
            const { thalesStaked } = stakingThalesQuery.data;
            setThalesStaked(Number(thalesStaked));
        }
        if (escrowThalesQuery.isSuccess && escrowThalesQuery.data) {
            setEscrowedBalance(escrowThalesQuery.data.escrowedBalance);
        }
    }, [stakingThalesQuery.isSuccess, escrowThalesQuery.isSuccess, stakingThalesQuery.data, escrowThalesQuery.data]);

    useEffect(() => {
        if (thalesBalanceQuery.isSuccess && thalesBalanceQuery.data) {
            setThalesBalance(Number(thalesBalanceQuery.data.balance));
        }
    }, [thalesBalanceQuery.isSuccess, thalesBalanceQuery.data]);

    useEffect(() => {
        setThalesTotalBalance(
            Number(thalesBalance.toFixed(2)) + Number(escrowedBalance.toFixed(2)) + Number(thalesStaked.toFixed(2))
        );
    }, [thalesBalance, escrowedBalance, thalesStaked]);

    return (
        <>
            <UserInfoWrapper className="dapp-header__userInfo" onClick={setOpen.bind(this, true)}>
                <SUSDBalance>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)}</SUSDBalance>
                <NetworkWrapper>
                    {!hideAddress && (
                        <AddressWrapper>
                            <p>
                                {truncateAddress(
                                    walletAddress,
                                    truncateAddressNumberOfCharacters,
                                    truncateAddressNumberOfCharacters
                                )}
                            </p>
                            <p>{network.networkName}</p>
                        </AddressWrapper>
                    )}
                    <Blockie marginRight={hideAddress ? 0 : 20} src={makeBlockie(walletAddress)} />
                </NetworkWrapper>
                <ThalesBalance>
                    {isL2 && (
                        <StyledMaterialTooltip
                            title={
                                <ThalesBalanceTooltip
                                    thalesBalance={thalesBalance}
                                    thalesStaked={thalesStaked}
                                    escrowedBalance={escrowedBalance}
                                />
                            }
                        >
                            <StyledInfoIcon width={iconSize} height={iconSize} />
                        </StyledMaterialTooltip>
                    )}
                    <span style={{ marginLeft: 10 }}>
                        {formatCurrencyWithKey(THALES_CURRENCY, isL2 ? thalesTotalBalance : thalesBalance)}
                    </span>
                </ThalesBalance>
            </UserInfoWrapper>
            <UserInfoModal
                walletAddress={walletAddress}
                network={network.networkName}
                open={open}
                handleClose={setOpen.bind(this, false)}
            />
        </>
    );
};

const UserInfoWrapper = styled(FlexDiv)`
    height: 40px;
    width: 320px;
    background: #0a2e66;
    border-radius: 30px;
    align-items: center;
    cursor: pointer;
    max-width: 100%;
`;

const SUSDBalance = styled.p`
    padding: 14px 10px 14px 20px !important;
    flex: 3;
    background: #0a2e66;
    border-radius: 30px;
    font-weight: bold;
    font-size: 13px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.4px;
    color: #f6f6fe;
    height: 100%;
    display: flex;
    align-items: center;
`;

const ThalesBalance = styled.p`
    padding: 14px 20px 14px 0 !important;
    flex: 3;
    background: #0a2e66;
    border-radius: 30px;
    font-weight: bold;
    font-size: 13px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.4px;
    color: #f6f6fe;
    height: 100%;
    display: flex;
    align-items: center;
    @media (max-width: 767px) {
        padding-left: 10px !important;
    }
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

const StyledInfoIcon = styled(InfoIcon)`
    margin-left: 10px;
    @media (max-width: 767px) {
        display: none;
    }
`;

const StyledMaterialTooltip = withStyles(() => ({
    arrow: {
        '&:before': {
            border: '1px solid #00D1FF',
        },
        color: '#04045A',
    },
    tooltip: {
        background: 'linear-gradient(281.48deg, #04045A -16.58%, #141874 97.94%)',
        borderRadius: '23px',
        border: '1px solid #0a2e66',
        padding: '15px',
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.4px',
        color: '#F6F6FE',
        maxWidth: 700,
    },
}))(MaterialTooltip);

export const Blockie = styled.img<{ marginRight: number }>`
    width: 18px;
    height: 18px;
    border-radius: 12px;
    margin-right: ${(props) => props.marginRight}px;
`;

export default UserInfo;
