import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDiv } from 'theme/common';
import Bridge from './Bridge';
import { useLocation } from 'react-router-dom';
import { history } from 'utils/routes';
import queryString from 'query-string';
import { TokenTabEnum } from 'types/token';
import { ScreenSizeBreakpoint } from 'constants/ui';

const Migration: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();

    return (
        <GridWrapper>
            <Wrapper>
                <Container>
                    <OptionsTab
                        onClick={() => {
                            history.push({
                                pathname: location.pathname,
                                search: queryString.stringify({
                                    tab: TokenTabEnum.MIGRATION,
                                }),
                            });
                        }}
                    >
                        {t(`migration.tabs.bridge`)}
                    </OptionsTab>
                    <Bridge />
                </Container>
            </Wrapper>
        </GridWrapper>
    );
};

const GridWrapper = styled(FlexDivColumnCentered)`
    grid-column: span 10;
    align-items: center;
`;

const Wrapper = styled(FlexDivColumnCentered)`
    background: ${(props) => props.theme.borderColor.secondary};
    padding: 1px;
    border-radius: 15px;
    margin: 60px 10px 50px 10px;
    min-width: 550px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        margin: 10px;
        min-width: 200px;
    }
`;

const Container = styled(FlexDivColumn)`
    background: ${(props) => props.theme.background.primary};
    border-radius: 15px;
    padding: 30px 60px 40px 60px;
    max-width: 550px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        padding: 30px 20px 40px 20px;
    }
`;

const OptionsTab = styled(FlexDiv)`
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.5px;
    color: ${(props) => props.theme.textColor.primary};
`;

export default Migration;
