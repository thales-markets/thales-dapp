import React, { useState } from 'react';

import {
    DescriptionContainer,
    FormWrapper,
    HeaderContainer,
    KeyValue,
    Label,
    StatisticsWrapper,
    StatLabel,
    StatValue,
    Text,
} from './styled-components';
import InputWithIcon from 'components/InputWithIcon';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';

const Referral: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState<string>('');
    const { t } = useTranslation();
    return (
        <>
            <HeaderContainer>
                <FormWrapper>
                    <Label>{t('referral-page.form-label')}</Label>
                    <Button
                        padding={'5px 0px'}
                        margin={'9px 0px 16px 0'}
                        active={true}
                        hoverShadow={'var(--button-shadow)'}
                    >
                        {t('referral-page.generate-link-btn')}
                    </Button>
                    <InputWithIcon
                        placeholder={'Enter wallet address'}
                        text={walletAddress}
                        handleChange={(value) => setWalletAddress(value)}
                    />
                </FormWrapper>
                <StatisticsWrapper>
                    <KeyValue>
                        <StatLabel>{t('referral-page.statistics.trades')}</StatLabel>
                        <StatValue>{formatCurrencyWithSign(USD_SIGN, 32000, 2)}</StatValue>
                    </KeyValue>
                    <KeyValue>
                        <StatLabel>{t('referral-page.statistics.total-volume')}</StatLabel>
                        <StatValue>{formatCurrencyWithSign(USD_SIGN, 32000, 2)}</StatValue>
                    </KeyValue>
                    <KeyValue>
                        <StatLabel>{t('referral-page.statistics.earned')}</StatLabel>
                        <StatValue>{formatCurrencyWithSign(USD_SIGN, 32000, 2)}</StatValue>
                    </KeyValue>
                </StatisticsWrapper>
                <DescriptionContainer>
                    <Text>{t('referral-page.description')}</Text>
                </DescriptionContainer>
            </HeaderContainer>
        </>
    );
};

export default Referral;
