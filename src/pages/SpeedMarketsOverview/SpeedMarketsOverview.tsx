import React from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import UnresolvedPositions from './components/UnresolvedPositions';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { RouteComponentProps } from 'react-router-dom';
import { getSupportedNetworksByRoute } from 'utils/network';
import SPAAnchor from 'components/SPAAnchor';
import { buildHref } from 'utils/routes';
import ROUTES from 'constants/routes';
import { useTranslation } from 'react-i18next';
import { FlexDivStart } from 'styles/common';

const SpeedMarketsOverview: React.FC<RouteComponentProps> = (props) => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const supportedNetworks = getSupportedNetworksByRoute(props.location?.pathname);

    return (
        <>
            {!supportedNetworks.includes(networkId) ? (
                <Info style={{ marginTop: '100px', fontSize: '22px' }}>{t('common.coming-soon')}</Info>
            ) : (
                <Container>
                    <Header>
                        <SPAAnchor href={buildHref(ROUTES.Options.SpeedMarkets)}>
                            <BackLinkContainer>
                                <BackIcon className={`icon icon--left`} />
                                {t('speed-markets.title')}
                            </BackLinkContainer>
                        </SPAAnchor>
                        &nbsp;/ {t(`speed-markets.overview.title`)}
                    </Header>
                    <UnresolvedPositions />
                </Container>
            )}
        </>
    );
};

const Container = styled.div`
    width: 100%;
`;

const Header = styled(FlexDivStart)`
    font-size: 18px;
    line-height: 100%;
    width: 100%;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const BackLinkContainer = styled.span`
    :hover {
        text-decoration: underline;
    }
`;

const BackIcon = styled.i`
    font-weight: 400;
    font-size: 20px;
    margin-right: 6px;
    top: -2px;
    position: relative;
`;

const Info = styled.span`
    display: block;
    text-align: justify;
    font-size: 18px;
    font-weight: 300;
    line-height: 110%;
    color: ${(props) => props.theme.textColor.primary};
`;

export default SpeedMarketsOverview;