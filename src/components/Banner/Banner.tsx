import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';
import SPAAnchor from '../SPAAnchor';

type BannerProps = {
    isLandingPage?: boolean;
};

const Banner: React.FC<BannerProps> = ({ isLandingPage }) => {
    return (
        <>
            {isLandingPage ? (
                <Info>
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
                </Info>
            ) : (
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
            )}
        </>
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

const BoldedText = styled.strong`
    font-weight: 800;
`;

const Info = styled.div`
    width: 100%;
    color: ${(props) => props.theme.textColor.primary};
    text-align: center;
    padding: 10px;
    font-size: 16px;
    background-color: ${(props) => props.theme.landingPage.background.secondary};
    box-shadow: 0px 0px 20px rgb(0 0 0 / 40%);
    z-index: 2;
    position: absolute;
    strong {
        font-weight: bold;
        cursor: pointer;
        margin-left: 0.2em;
        color: #91bced;
    }
    a,
    ${Label} {
        display: contents;
        cursor: pointer;
        color: #91bced;
    }
`;

export default Banner;
