import Button from 'components/ButtonV2';
import ROUTES from 'constants/routes';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered } from 'styles/common';
import { navigateTo } from 'utils/routes';

const MigrationNotice: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Wrapper>
            <Container>
                <Text>
                    <MigrateText>{t('migration.migration-notice.text')}</MigrateText>
                    <FlexDivCentered>
                        <Button onClick={() => navigateTo(ROUTES.Options.TokenMigration, true)}>
                            {t('migration.migration-notice.button-label')}
                        </Button>
                    </FlexDivCentered>
                </Text>
            </Container>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivColumnCentered)`
    border: none;
    background: ${(props) => props.theme.borderColor.secondary};
    border-radius: 10px;
    padding: 1px;
    margin-bottom: 15px;
`;

const Container = styled(FlexDivCentered)`
    background: ${(props) => props.theme.background.primary};
    border-radius: 10px;
    padding: 18px 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 20px 20px;
    }
`;

const Text = styled(FlexDiv)`
    font-weight: normal;
    font-size: 16px;
    line-height: 30px;
    color: ${(props) => props.theme.textColor.primary};
    align-items: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-bottom: 20px;
        margin-right: 0;
        text-align: center;
        flex-direction: column;
    }
`;

const MigrateText = styled.span`
    margin-right: 15px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-right: 0;
    }
`;

export default MigrationNotice;
