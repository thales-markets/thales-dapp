import React from 'react';
import { LINKS } from 'constants/links';
import {
    Conatiner,
    Title,
    Description,
    Formula,
    FormulaLeftSide,
    FormulaAmount,
    FormulaRequiredAmount,
    FormulaSign,
    FormulaRightSide,
    Link,
} from '../components';
import { useTranslation } from 'react-i18next';

type AmmTooltipProps = {
    maxPercentage: number;
    ammVolumeRewardsMultiplier: number;
};

const AmmTooltip: React.FC<AmmTooltipProps> = ({ maxPercentage, ammVolumeRewardsMultiplier }) => {
    const { t } = useTranslation();

    return (
        <Conatiner>
            <Title>{t('options.earn.thales-staking.staking-rewards.bonus-tooltip.amm-title')}</Title>
            <Description>
                {t('options.earn.thales-staking.staking-rewards.bonus-tooltip.amm-description', {
                    max: maxPercentage,
                    ammVolumeRewardsMultiplier: ammVolumeRewardsMultiplier,
                })}
            </Description>
            <Formula>
                <FormulaLeftSide>
                    <FormulaAmount>amountTraded</FormulaAmount>
                    <FormulaRequiredAmount>{ammVolumeRewardsMultiplier * 100}</FormulaRequiredAmount>
                </FormulaLeftSide>
                <FormulaSign>X</FormulaSign>
                <FormulaRightSide>{maxPercentage}</FormulaRightSide>
            </Formula>
            <Link target="_blank" rel="noreferrer" href={LINKS.Token.Bonus.AMM}>
                {t('options.earn.thales-staking.staking-rewards.bonus-button.amm-label')}
            </Link>
        </Conatiner>
    );
};

export default AmmTooltip;
