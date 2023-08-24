import React from 'react';
import styled from 'styled-components';
import UnresolvedPositions from './components/UnresolvedPositions';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { RouteComponentProps } from 'react-router-dom';
import SPAAnchor from 'components/SPAAnchor';
import { buildHref } from 'utils/routes';
import ROUTES from 'constants/routes';
import { useTranslation } from 'react-i18next';
import { FlexDivStart } from 'styles/common';

const SpeedMarketsOverview: React.FC<RouteComponentProps> = () => {
    const { t } = useTranslation();

    return (
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

export default SpeedMarketsOverview;
