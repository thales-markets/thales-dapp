import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';
import SPAAnchor from '../SPAAnchor';

const Banner: React.FC = () => {
    return (
        <Container>
            <SPAAnchor href={'https://dune.com/leifu/op-incentive-program'}>
                <Label>
                    <Trans
                        i18nKey="common.banner.op-rewards-banner-message"
                        components={{
                            bold: <BoldedText />,
                        }}
                    />
                </Label>
            </SPAAnchor>
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
    font-weight: 400;
`;

const BoldedText = styled.span`
    font-weight: 800;
`;

export default Banner;
