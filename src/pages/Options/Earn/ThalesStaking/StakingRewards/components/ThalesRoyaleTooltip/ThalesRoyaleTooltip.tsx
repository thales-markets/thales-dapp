import React from 'react';
import { LINKS } from 'constants/links';
import { Conatiner, Title, Description, Link } from '../components';
import { useTranslation } from 'react-i18next';

type ThalesRoyaleTooltipProps = {
    maxPercentage: number;
    participatedInRoyale: boolean;
};

const ThalesRoyaleTooltip: React.FC<ThalesRoyaleTooltipProps> = ({ maxPercentage, participatedInRoyale }) => {
    const { t } = useTranslation();

    return (
        <Conatiner>
            <Title>{t('options.earn.thales-staking.staking-rewards.bonus-tooltip.thales-royale-title')}</Title>
            <Description>
                {t('options.earn.thales-staking.staking-rewards.bonus-tooltip.thales-royale-description', {
                    max: maxPercentage,
                })}
            </Description>
            {!participatedInRoyale && (
                <Link target="_blank" rel="noreferrer" href={LINKS.Token.Bonus.ThalesRoyale}>
                    {t('options.earn.thales-staking.staking-rewards.bonus-button.thales-royale-label')}
                </Link>
            )}
        </Conatiner>
    );
};

export default ThalesRoyaleTooltip;
