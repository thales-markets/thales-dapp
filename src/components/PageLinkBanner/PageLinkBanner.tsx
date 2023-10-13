import SpeedLogoImg from 'assets/images/speed-markets/speed-markets-logo.svg';
import arrowRightAnimation from 'assets/lotties/rigth-arrows.json';
import SPAAnchor from 'components/SPAAnchor';
import ROUTES from 'constants/routes';
import Lottie from 'lottie-react';
import React, { CSSProperties } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import { buildHref } from 'utils/routes';

type PageLinkBannerProps = { rout: string };

const PageLinkBanner: React.FC<PageLinkBannerProps> = ({ rout }) => {
    let textKey = '';
    let imageSrc = '';
    switch (rout) {
        case ROUTES.Options.Home:
            textKey = 'common.banner.page-link.markets';
            break;
        case ROUTES.Options.SpeedMarkets:
            textKey = 'common.banner.page-link.speed-markets';
            imageSrc = SpeedLogoImg;
            break;
    }

    return (
        <SPAAnchor href={buildHref(rout)}>
            <Content>
                <Text>
                    <Trans
                        i18nKey={textKey}
                        components={{
                            bold: <BoldText />,
                        }}
                    />
                </Text>
                {imageSrc && (
                    <Text>
                        <Image src={imageSrc} />
                    </Text>
                )}
                <Lottie animationData={arrowRightAnimation} style={arrowRightStyle} />
            </Content>
        </SPAAnchor>
    );
};

const Content = styled(FlexDivCentered)`
    position: relative;
    height: 30px;
    background: ${(props) => props.theme.borderColor.tertiary};
    border-radius: 8px;
`;

const Text = styled.span`
    color: ${(props) => props.theme.button.textColor.primary};
    text-align: center;
    font-size: 13px;
    font-weight: 400;
    line-height: 100%;
`;

const BoldText = styled(Text)`
    font-weight: 600;
`;

const Image = styled.img`
    margin-bottom: -1px;
    padding-left: 3px;
`;

const arrowRightStyle: CSSProperties = {
    height: 30,
    width: 30,
    position: 'absolute',
    right: 0,
    // top: -12,
};

export default PageLinkBanner;
