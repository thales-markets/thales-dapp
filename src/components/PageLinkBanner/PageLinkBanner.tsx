import SpeedLogoImg from 'assets/images/speed-markets/speed-markets-logo.svg';
import arrowRightAnimation from 'assets/lotties/rigth-arrows.json';
import SPAAnchor from 'components/SPAAnchor';
import ROUTES from 'constants/routes';
import { ScreenSizeBreakpoint } from 'enums/ui';
import Lottie from 'lottie-react';
import React, { CSSProperties } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsMobile } from 'redux/modules/ui';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import { buildHref } from 'utils/routes';

type PageLinkBannerProps = { rout: string };

const PageLinkBanner: React.FC<PageLinkBannerProps> = ({ rout }) => {
    const { t } = useTranslation();
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    let textKey = '';
    let tryMarketsValue = '';
    let imageSrc = '';
    switch (rout) {
        case ROUTES.Options.Home:
            textKey = 'common.banner.page-link.thales-markets';
            tryMarketsValue = 'markets.title';
            break;
        case ROUTES.Options.SpeedMarkets:
            textKey = 'common.banner.page-link.speed-markets';
            tryMarketsValue = isMobile ? 'speed-markets.title' : '';
            imageSrc = SpeedLogoImg;
            break;
    }

    return (
        <SPAAnchor href={buildHref(rout)}>
            <Content>
                <Text>
                    {t(textKey)}{' '}
                    <Text noWrap>
                        <Trans
                            i18nKey="common.banner.page-link.try"
                            components={{
                                bold: <BoldText />,
                                value: t(tryMarketsValue),
                            }}
                        />
                    </Text>
                </Text>
                {!isMobile && imageSrc && (
                    <Text>
                        <Image src={imageSrc} />
                    </Text>
                )}
                {!isMobile && <Lottie animationData={arrowRightAnimation} style={arrowRightStyle} />}
            </Content>
        </SPAAnchor>
    );
};

const Content = styled(FlexDivCentered)`
    position: relative;
    height: 30px;
    background: ${(props) => props.theme.borderColor.tertiary};
    border-radius: 8px;
    padding: 5px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        height: 40px;
    }
`;

const Text = styled.span<{ noWrap?: boolean }>`
    color: ${(props) => props.theme.button.textColor.primary};
    text-align: center;
    font-size: 13px;
    font-weight: 400;
    line-height: 100%;
    ${(props) => (props.noWrap ? 'white-space: nowrap;' : '')}
`;

const BoldText = styled(Text)`
    font-weight: 600;
`;

const Image = styled.img`
    margin-bottom: -1px;
    padding-left: 3px;
`;

const arrowRightStyle: CSSProperties = {
    width: 30,
    height: 30,
    marginTop: -1,
};

export default PageLinkBanner;
