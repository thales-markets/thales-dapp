import React, { useEffect, useState } from 'react';
import { ClaimDiv, ClaimTitle, EarnSection, SectionContent, SectionHeader } from '../../components';
import { formatCurrencyWithKey } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import { Button, FlexDiv } from '../../../../../theme/common';
import ValidationMessage from '../../../../../components/ValidationMessage/ValidationMessage';
import { useTranslation } from 'react-i18next';
import useStakingThalesQuery from '../../../../../queries/staking/useStakingThalesQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsAppReady } from '../../../../../redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';

const MyRewards: React.FC = () => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const [rewards, setRewards] = useState(0);

    useEffect(() => {
        if (stakingThalesQuery.isSuccess && stakingThalesQuery.data) {
            setRewards(stakingThalesQuery.data.rewards);
        }
    }, [stakingThalesQuery.isSuccess]);

    return (
        <EarnSection style={{ gridColumn: 'span 4' }}>
            <SectionHeader>My Rewards</SectionHeader>
            <SectionContent>
                <ClaimDiv>
                    <ClaimTitle>{t('options.earn.thales-staking.my-rewards.amount-to-claim')}:</ClaimTitle>
                    <span>{formatCurrencyWithKey(THALES_CURRENCY, rewards)}</span>
                </ClaimDiv>
                <FlexDiv>
                    <Button className="primary" disabled={!rewards}>
                        {t('options.earn.thales-staking.my-rewards.claim')}
                    </Button>
                </FlexDiv>
            </SectionContent>
            <div style={{ marginBottom: '15px' }}>
                <ValidationMessage showValidation={false} message={''} onDismiss={() => {}} />
            </div>
        </EarnSection>
    );
};

export default MyRewards;
