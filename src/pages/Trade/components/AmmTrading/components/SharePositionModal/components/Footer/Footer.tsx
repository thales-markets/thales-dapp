import React from 'react';
import styled from 'styled-components';
import { Trans } from 'react-i18next';

const Footer: React.FC = () => {
    return (
        <Container>
            <ThalesLogo className="icon-home icon-home--thales" />
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
    align-items: center;
    width: 100%;
`;

const ThalesLogo = styled.i`
    font-size: 100px !important;
    color: ${(props) => props.theme.textColor.primary};
`;

const Text = styled.div`
    font-size: 10px;
    font-weight: 200;
    color: ${(props) => props.theme.textColor.primary};
    text-transform: uppercase;
    width: 204px;
    text-align: right;
`;

const BoldText = styled.span`
    font-size: 10px;
    font-weight: 700;
    color: ${(props) => props.theme.textColor.primary};
    line-height: 120%;
`;

export default Footer;
