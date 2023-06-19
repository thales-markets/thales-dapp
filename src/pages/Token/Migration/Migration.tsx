import { TokenTabEnum } from 'enums/token';
import { ScreenSizeBreakpoint } from 'enums/ui';
import queryString from 'query-string';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, FlexDivColumnCentered } from 'styles/common';
import { history } from 'utils/routes';
import Bridge from './Bridge';

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
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin: 10px;
        min-width: 200px;
    }
`;

const Container = styled(FlexDivColumn)`
    background: ${(props) => props.theme.background.primary};
    border-radius: 15px;
    padding: 30px 60px 40px 60px;
    max-width: 550px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
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
