import React from 'react';
import styled from 'styled-components';
import { Trans } from 'react-i18next';
import LogoIcon from 'assets/images/logo-light.svg';

const Footer: React.FC = () => {
    return (
        <Container>
            <ThalesLogo src={LogoIcon} />
            <Text>
                <Trans
                    i18nKey="common.flex-card.footer-text"
                    components={{
                        bold: <BoldText />,
                    }}
                />
            </Text>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    height: 50px;
    margin-bottom: -10px;
`;

const ThalesLogo = styled.img``;

const Text = styled.div`
    font-size: 10px;
    font-weight: 100;
    color: ${(props) => props.theme.textColor.primary};
    text-transform: uppercase;
    width: 204px;
    text-align: right;
    word-spacing: 0.3ch;
`;

const BoldText = styled.span`
    font-size: 10px;
    font-weight: 700;
    color: ${(props) => props.theme.textColor.primary};
    line-height: 120%;
`;

export default Footer;
