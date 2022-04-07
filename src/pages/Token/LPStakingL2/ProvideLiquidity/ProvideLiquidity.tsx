import React from 'react';
import { EarnSection } from '../../components';
import styled from 'styled-components';
import { FlexDivStart } from 'theme/common';
import { useTranslation } from 'react-i18next';

const ProvideLiquidity: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <EarnSection
                spanOnTablet={5}
                orderOnMobile={4}
                orderOnTablet={4}
                style={{ padding: '16px', gridColumn: 'span 5', gridRow: 'span 2' }}
            >
                <Description>{t('options.earn.lp-staking.provide-liquidity.description')}</Description>
                <Description>
                    {t('options.earn.lp-staking.provide-liquidity.wrap-your-eth')}
                    <StyledAnchor
                        href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x4200000000000000000000000000000000000006&chain=optimism"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('options.earn.lp-staking.provide-liquidity.here')}
                    </StyledAnchor>
                </Description>
                <Description>
                    {t('options.earn.lp-staking.provide-liquidity.deposit')}
                    <StyledAnchor
                        href="https://www.sorbet.finance/#/pools/0xac6705BC7f6a35eb194bdB89066049D6f1B0B1b5"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('options.earn.lp-staking.provide-liquidity.here')}
                    </StyledAnchor>
                </Description>
                <Description>{t('options.earn.lp-staking.provide-liquidity.stake-here')}</Description>
            </EarnSection>
        </>
    );
};

const Description = styled(FlexDivStart)`
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 24px;
    color: #ffffff;
    flex: 1;
`;

const StyledAnchor = styled.a`
    padding-left: 5px;
    color: #8208fc;
`;

export default ProvideLiquidity;
