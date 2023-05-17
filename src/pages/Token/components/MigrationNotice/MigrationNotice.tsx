import { DefaultSubmitButton } from '../components';
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FlexDivCentered } from 'theme/common';
import ROUTES from 'constants/routes';
import { navigateTo } from 'utils/routes';
import Notice from '../Notice';

const MigrationNotice: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Notice>
            <MigrateText>{t('migration.migration-notice.text')}</MigrateText>
            <FlexDivCentered>
                <MigrateButton onClick={() => navigateTo(ROUTES.Options.TokenMigration, true)}>
                    {t('migration.migration-notice.button-label')}
                </MigrateButton>
            </FlexDivCentered>
        </Notice>
    );
};

export const MigrateText = styled.span`
    margin-right: 15px;
    @media (max-width: 767px) {
        margin-right: 0;
    }
`;

export const MigrateButton = styled(DefaultSubmitButton)`
    background: ${(props) => props.theme.button.background.primary};
    &:hover:not(:disabled) {
        background: ${(props) => props.theme.button.background.primary};
    }
    white-space: nowrap;
`;

export default MigrationNotice;
