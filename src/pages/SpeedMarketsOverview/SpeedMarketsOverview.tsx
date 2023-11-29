import SPAAnchor from 'components/SPAAnchor';
import ROUTES from 'constants/routes';
import { Network } from 'enums/network';
import queryString from 'query-string';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { buildHref } from 'utils/routes';
import UnresolvedChainedPositions from './components/UnresolvedChainedPositions';
import UnresolvedPositions from './components/UnresolvedPositions';
import { Container, Header, LinkContainer, NavigationIcon } from './styled-components';

const SpeedMarketsOverview: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));

    // TODO: remove after contarct deploy on all chains
    const isChainedMarkets = [Network.Arbitrum, Network.OptimismMainnet, Network.PolygonMainnet].includes(networkId)
        ? false
        : queryString.parse(location.search).isChained === 'true';

    return (
        <Container>
            <Header>
                <div>
                    <SPAAnchor href={`${buildHref(ROUTES.Options.SpeedMarkets)}?isChained=${isChainedMarkets}`}>
                        <LinkContainer>
                            <NavigationIcon isLeft className={`icon icon--left`} />
                            {isChainedMarkets ? t('speed-markets.overview.back-chained') : t('speed-markets.title')}
                        </LinkContainer>
                    </SPAAnchor>
                    &nbsp;/&nbsp;{t(`speed-markets.overview.title`)}
                </div>
                <div>
                    {t(`speed-markets.overview.title`)}&nbsp;/&nbsp;
                    <SPAAnchor
                        href={`${buildHref(ROUTES.Options.SpeedMarketsOverview)}?isChained=${!isChainedMarkets}`}
                    >
                        <LinkContainer>
                            {isChainedMarkets ? t('speed-markets.title') : t('speed-markets.overview.back-chained')}
                            <NavigationIcon isLeft={false} className={`icon icon--right`} />
                        </LinkContainer>
                    </SPAAnchor>
                </div>
            </Header>
            {isChainedMarkets ? <UnresolvedChainedPositions /> : <UnresolvedPositions />}
        </Container>
    );
};

export default SpeedMarketsOverview;
