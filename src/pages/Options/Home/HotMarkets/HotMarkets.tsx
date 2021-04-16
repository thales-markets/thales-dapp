import React, { useState } from 'react';
import { OptionsMarkets } from 'types/options';
import { useTranslation } from 'react-i18next';
import { FlexDivCentered, SubTitle } from 'theme/common';
import previous from 'assets/images/previous-page.svg';
import next from 'assets/images/next-page.svg';
import MarketCard from '../MarketCard';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, Image } from 'theme/common';
import useInterval from 'hooks/useInterval';

const Wrapper = styled(FlexDivColumn)`
    padding: 50px 110px;
    position: relative;
`;

const Arrow = styled(Image)`
    width: 24px;
    height: 40px;
    margin: 0 10px;
    cursor: pointer;
`;

const Pagination = styled(FlexDiv)`
    align-self: center;
    margin-bottom: 40px;
`;
const PaginationPage = styled.span`
    width: 24px;
    height: 4px;
    background: #b8c6e5;
    &.current {
        background: #04045a;
    }
    margin: 4px;
`;

type HotMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

export const HotMarkets: React.FC<HotMarketsProps> = ({ optionsMarkets }) => {
    const { t } = useTranslation();

    const [currentMarketPage, setCurrentMarketPage] = useState(0);

    const NextMarkets = () => {
        currentMarketPage === 2 ? setCurrentMarketPage(0) : setCurrentMarketPage(currentMarketPage + 1);
    };

    useInterval(() => {
        NextMarkets();
    }, 5000);

    const PreviousMarkets = () => {
        currentMarketPage === 0 ? setCurrentMarketPage(2) : setCurrentMarketPage(currentMarketPage - 1);
    };

    return (
        <Wrapper>
            <SubTitle color="#04045a">{t('options.home.explore-markets.discover')}</SubTitle>
            <FlexDivCentered>
                <Arrow onClick={PreviousMarkets} src={previous}></Arrow>
                {optionsMarkets.map((optionsMarket, index) => {
                    if (index >= currentMarketPage * 3 && index < currentMarketPage * 3 + 3) {
                        return <MarketCard key={index} optionMarket={optionsMarket} />;
                    }
                })}
                <Arrow onClick={NextMarkets} src={next}></Arrow>
            </FlexDivCentered>
            <Pagination>
                <PaginationPage className={currentMarketPage === 0 ? 'current' : ''} />
                <PaginationPage className={currentMarketPage === 1 ? 'current' : ''} />
                <PaginationPage className={currentMarketPage === 2 ? 'current' : ''} />
            </Pagination>
        </Wrapper>
    );
};

export default HotMarkets;
