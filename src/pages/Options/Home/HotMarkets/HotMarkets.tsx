import React from 'react';
import { OptionsMarkets } from 'types/options';
import { useTranslation } from 'react-i18next';
import { FlexDivCentered, FlexDivColumn, SubTitle } from 'theme/common';
import styled from 'styled-components';

import MarketCard from '../MarketCard';
import snxJSConnector from 'utils/snxJSConnector';

type HotMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

export const HotMarkets: React.FC<HotMarketsProps> = ({ optionsMarkets }) => {
    const { t } = useTranslation();

    const Wrapper = styled(FlexDivColumn)`
        padding: 50px 110px;
    `;

    console.log(snxJSConnector);

    return (
        <Wrapper>
            <SubTitle color="#04045a">{t('options.home.explore-markets.discover')}</SubTitle>
            <FlexDivCentered>
                {optionsMarkets.map((optionsMarket, index) => (
                    <MarketCard key={index} optionMarket={optionsMarket} />
                ))}
            </FlexDivCentered>
        </Wrapper>
    );
};

export default HotMarkets;
