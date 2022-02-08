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

type SnxStakingTooltipProps = {
    maxPercentage: number;
    snxVolumeRewardsMultiplier: number;
    snxStakedMaxBonus: boolean;
};

const SnxStakingTooltip: React.FC<SnxStakingTooltipProps> = ({
    maxPercentage,
    snxVolumeRewardsMultiplier,
    snxStakedMaxBonus,
}) => {
    const { t } = useTranslation();

    return (
        <Conatiner>
            <Title>{t('options.earn.thales-staking.staking-rewards.bonus-tooltip.snx-staking-title')}</Title>
            <Description>
                {t('options.earn.thales-staking.staking-rewards.bonus-tooltip.snx-staking-description', {
                    max: maxPercentage,
                    snxVolumeRewardsMultiplier: snxVolumeRewardsMultiplier,
                })}
            </Description>
            <Formula>
                <FormulaLeftSide>
                    <FormulaAmount>amountSNXStaked</FormulaAmount>
                    <FormulaRequiredAmount>baseRewards</FormulaRequiredAmount>
                </FormulaLeftSide>
                <FormulaSign>X</FormulaSign>
                <FormulaRightSide>{maxPercentage}</FormulaRightSide>
            </Formula>
            {!snxStakedMaxBonus && (
                <Link target="_blank" rel="noreferrer" href={LINKS.Token.Bonus.SnxStaking}>
                    {t('options.earn.thales-staking.staking-rewards.bonus-button.snx-staking-label')}
                </Link>
            )}
        </Conatiner>
    );
};

export default SnxStakingTooltip;
