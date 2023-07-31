import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import UnresolvedPosition from '../UnresolvedPosition';
import useActiveSpeedMarketsDataQuery from 'queries/options/speedMarkets/useActiveSpeedMarketsDataQuery';

const UnresolvedPositions: React.FC = () => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const activeSpeedMarketsDataQuery = useActiveSpeedMarketsDataQuery(networkId, {
        enabled: isAppReady,
    });

    const activeSpeedMarketsData = useMemo(
        () =>
            activeSpeedMarketsDataQuery.isSuccess && activeSpeedMarketsDataQuery.data
                ? activeSpeedMarketsDataQuery.data
                : [],
        [activeSpeedMarketsDataQuery]
    );

    const userWinnerSpeedMarketsData = activeSpeedMarketsData
        .filter((marketData) => marketData.claimable && !!marketData.finalPrice)
        .sort((a, b) => a.maturityDate - b.maturityDate);
    const ammWinnerSpeedMarketsData = activeSpeedMarketsData
        .filter((marketData) => !marketData.claimable && !!marketData.finalPrice)
        .sort((a, b) => a.maturityDate - b.maturityDate);
    const unknownPriceSpeedMarketsData = activeSpeedMarketsData
        .filter((marketData) => !marketData.claimable && !marketData.finalPrice)
        .sort((a, b) => a.maturityDate - b.maturityDate);

    return (
        <Wrapper>
            <Title>{`${t('speed-markets.admin.user-title')} (${userWinnerSpeedMarketsData.length})`}</Title>
            {activeSpeedMarketsDataQuery.isLoading ? (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            ) : (
                <PositionsWrapper hasPositions={userWinnerSpeedMarketsData.length > 0}>
                    {userWinnerSpeedMarketsData.length > 0 ? (
                        userWinnerSpeedMarketsData.map((position, index) => (
                            <UnresolvedPosition position={position} key={`userWinner${index}`} />
                        ))
                    ) : (
                        <NoPositionsText>{t('speed-markets.admin.no-positions')}</NoPositionsText>
                    )}
                </PositionsWrapper>
            )}
            <Title>{`${t('speed-markets.admin.amm-title')} (${ammWinnerSpeedMarketsData.length})`}</Title>
            {activeSpeedMarketsDataQuery.isLoading ? (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            ) : (
                <PositionsWrapper hasPositions={userWinnerSpeedMarketsData.length > 0}>
                    {ammWinnerSpeedMarketsData.length > 0 ? (
                        ammWinnerSpeedMarketsData.map((position, index) => (
                            <UnresolvedPosition position={position} key={`ammWinner${index}`} />
                        ))
                    ) : (
                        <NoPositionsText>{t('speed-markets.admin.no-positions')}</NoPositionsText>
                    )}
                </PositionsWrapper>
            )}
            <Title>{`${t('speed-markets.admin.unknown-price-title')} (${unknownPriceSpeedMarketsData.length})`}</Title>
            {activeSpeedMarketsDataQuery.isLoading ? (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            ) : (
                <PositionsWrapper hasPositions={unknownPriceSpeedMarketsData.length > 0}>
                    {unknownPriceSpeedMarketsData.length > 0 ? (
                        unknownPriceSpeedMarketsData.map((position, index) => (
                            <UnresolvedPosition position={position} key={`unknownPrice${index}`} />
                        ))
                    ) : (
                        <NoPositionsText>{t('speed-markets.admin.no-positions')}</NoPositionsText>
                    )}
                </PositionsWrapper>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    padding-bottom: 20px;
`;

const PositionsWrapper = styled.div<{ hasPositions: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 6px;
    ${(props) => (props.hasPositions ? 'overflow-y: auto;' : '')}
    max-height: 560px;

    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: row;
        overflow: auto;
    }
`;

const Title = styled.span`
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    margin-left: 20px;
    margin-bottom: 10px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.secondary};
    :not(:first-child) {
        margin-top: 20px;
    }
`;

const LoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 200px;
    width: 100%;
`;

const NoPositionsText = styled.span`
    text-align: center;
    font-weight: 600;
    font-size: 15px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.secondary};
    min-width: max-content;
`;

export default UnresolvedPositions;
