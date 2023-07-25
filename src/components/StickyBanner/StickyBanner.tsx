import ROUTES from 'constants/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';
import { navigateTo } from 'utils/routes';

const StickyBanner: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Container onClick={() => navigateTo(ROUTES.Options.Token)}>
            <Label>{t('banner.main-paragraph')}</Label>
        </Container>
    );
};

const Container = styled(FlexDiv)`
    position: absolute;
    top: 0;
    width: 100%;
    align-items: center;
    justify-content: center;
    color: ${(_props) => _props.theme.button.textColor.primary};
    background-color: ${(_props) => _props.theme.borderColor.tertiary};
    min-height: 35px;
    z-index: 102;
    cursor: pointer;
    text-align: center;
`;

const Label = styled.span`
    color: ${(_props) => _props.theme.button.textColor.primary};
    font-size: 18px;
    padding: 9px 0px;
    font-style: normal;
    font-weight: 800;
    text-transform: uppercase;
`;

export default StickyBanner;
