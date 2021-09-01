import React, { useEffect, useState } from 'react';
import { ClaimTitle, EarnSection, EarnSymbol, SectionContent, SectionHeader } from '../../components';
import { formatCurrencyWithKey } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import useStakingThalesQuery from '../../../../../queries/staking/useStakingThalesQuery';
import useEscrowThalesQuery from '../../../../../queries/staking/useEscrowThalesQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsAppReady } from '../../../../../redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';
import { useTranslation } from 'react-i18next';
import { FlexDivColumnCentered, GradientText } from '../../../../../theme/common';

type Properties = {
    thalesStaked: number;
    setThalesStaked: (staked: number) => void;
};

const MyStake: React.FC<Properties> = ({ thalesStaked, setThalesStaked }) => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const [escrowedBalance, setEscrowedBalance] = useState(0);

    useEffect(() => {
        if (stakingThalesQuery.isSuccess && stakingThalesQuery.data) {
            setThalesStaked(stakingThalesQuery.data.thalesStaked);
        }
        if (escrowThalesQuery.isSuccess && escrowThalesQuery.data) {
            setEscrowedBalance(escrowThalesQuery.data.escrowedBalance);
        }
    }, [stakingThalesQuery.isSuccess, escrowThalesQuery.isSuccess]);

    return (
        <EarnSection style={{ gridColumn: 'span 6', gridRow: 'span 2', textAlign: 'center' }}>
            <SectionHeader>{t('options.earn.thales-staking.my-stake.my-stake')}</SectionHeader>
            <SectionContent style={{ paddingTop: '15px', height: '100%' }}>
                <FlexDivColumnCentered>
                    <ClaimTitle>{t('options.earn.thales-staking.my-stake.staked-in-contract')}:</ClaimTitle>
                    <GradientText
                        gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                        fontSize={25}
                        fontWeight={600}
                    >
                        {formatCurrencyWithKey(THALES_CURRENCY, thalesStaked)}
                    </GradientText>
                </FlexDivColumnCentered>
                <EarnSymbol>+</EarnSymbol>
                <FlexDivColumnCentered>
                    <ClaimTitle>{t('options.earn.thales-staking.my-stake.locked-in-escrow')}:</ClaimTitle>
                    <GradientText
                        gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                        fontSize={25}
                        fontWeight={600}
                    >
                        {formatCurrencyWithKey(THALES_CURRENCY, escrowedBalance)}
                    </GradientText>
                </FlexDivColumnCentered>
                <EarnSymbol>=</EarnSymbol>
                <FlexDivColumnCentered>
                    <ClaimTitle>{t('options.earn.thales-staking.my-stake.total-staked')}:</ClaimTitle>
                    <GradientText
                        gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                        fontSize={25}
                        fontWeight={600}
                    >
                        {formatCurrencyWithKey(THALES_CURRENCY, escrowedBalance + thalesStaked)}
                    </GradientText>
                </FlexDivColumnCentered>
            </SectionContent>
        </EarnSection>
    );
};

export default MyStake;
