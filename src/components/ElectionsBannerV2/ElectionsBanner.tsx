import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';
import { SpaceKey } from 'enums/governance';
import { TEMP_CHECK_PROPOSAL_ID } from 'constants/governance';
import { navigateToGovernance } from 'utils/routes';

const ElectionsBanner: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Container onClick={() => navigateToGovernance(SpaceKey.COUNCIL, TEMP_CHECK_PROPOSAL_ID)}>
            <Label>{t('banner.temp-check-banner-message')}</Label>
        </Container>
    );
};

const Container = styled(FlexDiv)`
    position: absolute;
    top: 0;
    width: 100%;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.button.textColor.primary};
    background-color: ${(props) => props.theme.background.quaternary};
    min-height: 35px;
    z-index: 102;
    cursor: pointer;
    text-align: center;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const Label = styled.span`
    color: ${(props) => props.theme.button.textColor.primary};
    font-size: 18px;
    padding: 9px 0px;
    font-style: normal;
    font-weight: 800;
    text-transform: uppercase;
`;

export default ElectionsBanner;
