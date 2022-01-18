import { DefaultSubmitButton } from 'pages/Options/Market/components';
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered } from 'theme/common';
import ROUTES from 'constants/routes';
import { navigateTo } from 'utils/routes';

const MigrationNotice: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Wrapper>
            <Conatiner>
                <Notice>{t('migration.migration-notice.text')}</Notice>
                <FlexDivCentered>
                    <MigrateButton onClick={() => navigateTo(ROUTES.Options.TokenMigration, true)}>
                        {t('migration.migration-notice.button-label')}
                    </MigrateButton>
                </FlexDivCentered>
            </Conatiner>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivColumnCentered)`
    border: none;
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    box-shadow: -2px -2px 10px 4px rgba(100, 217, 254, 0.25), 2px 2px 10px 4px rgba(100, 217, 254, 0.25);
    border-radius: 10px;
    padding: 2px;
    margin-bottom: 15px;
`;

const Conatiner = styled(FlexDivCentered)`
    background: #04045a;
    border-radius: 10px;
    padding: 18px 20px;
    @media (max-width: 767px) {
        flex-direction: column;
        padding: 20px 20px;
    }
`;

const Notice = styled(FlexDiv)`
    font-weight: normal;
    font-size: 16px;
    line-height: 30px;
    color: #ffffff;
    margin-right: 50px;
    @media (max-width: 767px) {
        margin-bottom: 20px;
        margin-right: 0;
        text-align: center;
    }
`;

export const MigrateButton = styled(DefaultSubmitButton)`
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    white-space: nowrap;
`;

export default MigrationNotice;
