import React from 'react';
import { Button, FlexDivCentered, FlexDivColumn, Side, Text } from 'theme/common';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/routes';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import './media.scss';
import SPAAnchor from '../../../../components/SPAAnchor';
import { buildHref } from '../../../../utils/routes';

const MarketCreation: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    return (
        <FlexDivColumn id="market-creation">
            <SideWrapper className="market-creation">
                <FlexDivCentered>
                    <Button
                        className="secondary market-creation__exploreBtn"
                        style={{ padding: '13px 24px', fontSize: 20 }}
                        onClick={() =>
                            document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' })
                        }
                    >
                        {t('options.home.market-creation.explore-markets-button-label')}
                    </Button>
                    {isWalletConnected && (
                        <>
                            <Text className="text-m pale-grey  market-creation__orTxt" style={{ margin: '0 135px' }}>
                                {t(`common.or`)}
                            </Text>
                            {
                                <SPAAnchor path={buildHref(ROUTES.Options.CreateMarket)}>
                                    <Button
                                        className="primary market-creation__createBtn"
                                        style={{ padding: '13px 24px', fontSize: 20 }}
                                    >
                                        {t('options.home.market-creation.create-market-button-label')}
                                    </Button>
                                </SPAAnchor>
                            }
                        </>
                    )}
                </FlexDivCentered>
            </SideWrapper>
        </FlexDivColumn>
    );
};

const SideWrapper = styled(Side)`
    padding-top: 55px !important;
    padding-bottom: 85px !important;
`;

// const CreateMarket = styled(FlexDivColumn)`
//     color: white;
//     align-items: center;
//     position: relative;
//     background-color: #1c1a71;
//     background-clip: padding-box;
//     border: solid 2px transparent;
//     border-radius: 24px;
//     color: #f6f6fe;
//     margin: 75px;
//     height: 280px;
//     &:before {
//         content: '';
//         position: absolute;
//         top: 0;
//         right: 0;
//         bottom: 0;
//         left: 0;
//         z-index: -1;
//         margin: -2px;
//         border-radius: inherit;
//         background: linear-gradient(#6ac1d5, #ca91dc);
//         border: 2px dashed #04045a;
//     }
// `;

// const Description = styled.p`
//     margin: 0;
//     margin-top: 28px !important;
//     text-align: center;
//     font-weight: bold;
//     font-size: 25px;
//     line-height: 45px;
//     letter-spacing: 0.25px;
//     color: #f6f6fe;
//     width: 747px;
// `;

// const CreateMarketButtonWrapper = styled(FlexDivColumn)`
//     margin-top: 80px;
//     margin-bottom: 30px;
// `;

export default MarketCreation;
