import { TokenTabEnum, TokenTabSectionIdEnum } from 'enums/token';
import { ScreenSizeBreakpoint } from 'enums/ui';
import queryString from 'query-string';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OutsideClickHandler from 'react-outside-click-handler';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { TokenTabSection } from 'types/token';
import { getIsArbitrum, getIsOVM } from 'utils/network';
import { history } from 'utils/routes';

type TokenNavProps = {
    tabSections: TokenTabSection[];
    setSelectedTab: any;
    setSelectedSection: (sectionId: TokenTabSectionIdEnum) => void;
    selectedSection: TokenTabSectionIdEnum | undefined;
};

const TokenNavFooter: React.FC<TokenNavProps> = ({
    tabSections,
    setSelectedTab,
    selectedSection,
    setSelectedSection,
}) => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId) || getIsArbitrum(networkId);
    const isOP = getIsOVM(networkId);

    const [showNav, setShowNav] = useState(false);

    const onItemClick = (tokenTab: TokenTabEnum, tokenTabId: TokenTabSectionIdEnum) => {
        history.push({
            pathname: location.pathname,
            search: queryString.stringify({
                tab: tokenTab,
                activeButtonId: tokenTabId,
            }),
        });
        setSelectedTab(tokenTab);
        setSelectedSection(tokenTabId);
    };

    const getSectionItem = (id: TokenTabSectionIdEnum) => {
        return tabSections.find((item) => item.id == id);
    };

    return (
        <OutsideClickHandler onOutsideClick={() => setShowNav(false)}>
            <NavFooter>
                <BurgerWrapper onClick={setShowNav.bind(this, !showNav)}>
                    <BurgerLine />
                    <BurgerLine />
                    <BurgerLine />
                </BurgerWrapper>
                {showNav && (
                    <Container>
                        <ItemContainer
                            onClick={() => onItemClick(TokenTabEnum.GAMIFIED_STAKING, TokenTabSectionIdEnum.REWARDS)}
                        >
                            <Label active={selectedSection == TokenTabSectionIdEnum.REWARDS}>
                                {getSectionItem(TokenTabSectionIdEnum.REWARDS)
                                    ? getSectionItem(TokenTabSectionIdEnum.REWARDS)?.title
                                    : ''}
                            </Label>
                            <IconContainer active={selectedSection == TokenTabSectionIdEnum.REWARDS}>
                                {'R'}
                            </IconContainer>
                        </ItemContainer>
                        {isL2 && (
                            <ItemContainer
                                onClick={() =>
                                    onItemClick(TokenTabEnum.GAMIFIED_STAKING, TokenTabSectionIdEnum.LEADERBOARD)
                                }
                            >
                                <Label active={selectedSection == TokenTabSectionIdEnum.LEADERBOARD}>
                                    {getSectionItem(TokenTabSectionIdEnum.LEADERBOARD)
                                        ? getSectionItem(TokenTabSectionIdEnum.LEADERBOARD)?.title
                                        : ''}
                                </Label>
                                <IconContainer active={selectedSection == TokenTabSectionIdEnum.LEADERBOARD}>
                                    {'L'}
                                </IconContainer>
                            </ItemContainer>
                        )}
                        {isL2 && (
                            <ItemContainer
                                onClick={() =>
                                    onItemClick(TokenTabEnum.GAMIFIED_STAKING, TokenTabSectionIdEnum.STAKING)
                                }
                            >
                                <Label active={selectedSection == TokenTabSectionIdEnum.STAKING}>
                                    {getSectionItem(TokenTabSectionIdEnum.STAKING)
                                        ? getSectionItem(TokenTabSectionIdEnum.STAKING)?.title
                                        : ''}
                                </Label>
                                <IconContainer active={selectedSection == TokenTabSectionIdEnum.STAKING}>
                                    {'S'}
                                </IconContainer>
                            </ItemContainer>
                        )}
                        {isL2 && (
                            <ItemContainer
                                onClick={() =>
                                    onItemClick(TokenTabEnum.GAMIFIED_STAKING, TokenTabSectionIdEnum.VESTING)
                                }
                            >
                                <Label active={selectedSection == TokenTabSectionIdEnum.VESTING}>
                                    {getSectionItem(TokenTabSectionIdEnum.VESTING)
                                        ? getSectionItem(TokenTabSectionIdEnum.VESTING)?.title
                                        : ''}
                                </Label>
                                <IconContainer active={selectedSection == TokenTabSectionIdEnum.VESTING}>
                                    {'V'}
                                </IconContainer>
                            </ItemContainer>
                        )}
                        {isL2 && (
                            <ItemContainer
                                onClick={() =>
                                    onItemClick(TokenTabEnum.GAMIFIED_STAKING, TokenTabSectionIdEnum.MERGE_ACCOUNT)
                                }
                            >
                                <Label active={selectedSection == TokenTabSectionIdEnum.MERGE_ACCOUNT}>
                                    {getSectionItem(TokenTabSectionIdEnum.MERGE_ACCOUNT)
                                        ? getSectionItem(TokenTabSectionIdEnum.MERGE_ACCOUNT)?.title
                                        : ''}
                                </Label>
                                <IconContainer active={selectedSection == TokenTabSectionIdEnum.MERGE_ACCOUNT}>
                                    {'A'}
                                </IconContainer>
                            </ItemContainer>
                        )}

                        {isOP && (
                            <ItemContainer
                                onClick={() => onItemClick(TokenTabEnum.LP_STAKING, TokenTabSectionIdEnum.LP_STAKING)}
                            >
                                <Label active={selectedSection == TokenTabSectionIdEnum.LP_STAKING}>
                                    {t('thales-token.lp-staking.tab-title')}
                                </Label>
                                <IconContainer active={selectedSection == TokenTabSectionIdEnum.LP_STAKING}>
                                    {'LP'}
                                </IconContainer>
                            </ItemContainer>
                        )}
                    </Container>
                )}
            </NavFooter>
        </OutsideClickHandler>
    );
};

const NavFooter = styled.div`
    @media (min-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 75px;
    right: -20px;
    width: 100px;
    padding: 0 10px;
    z-index: 999;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    position: fixed;
    box-sizing: border-box;
    padding-bottom: 130px;
    height: 420px;
    bottom: 0px;
    right: 0px;
    padding-left: 10px;
    padding-right: 10px;
    background: linear-gradient(360deg, #181a20 68.24%, rgba(24, 26, 32, 0.4) 99.35%);
    width: 100%;
`;

const ItemContainer = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
`;

const Label = styled.span<{ active?: boolean }>`
    font-size: 13px;
    text-align: right;
    font-weight: 500;
    color: ${(props) => (props.active ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
`;

const IconContainer = styled.span<{ active?: boolean }>`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    font-size: 13px;
    background-color: ${(props) =>
        props.active ? props.theme.button.background.primary : props.theme.button.background.tertiary};
    color: ${(props) => (props.active ? props.theme.button.textColor.primary : props.theme.button.textColor.secondary)};
    border-radius: 50%;
    margin-left: 10px;
`;

const BurgerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 26.1818px;
    z-index: 998;
`;

const BurgerLine = styled.div`
    width: 27px;
    height: 4px;
    background: ${(props) => props.theme.textColor.primary};
    border-radius: 5px;
    &:nth-child(2) {
        margin-top: 4px;
        margin-bottom: 4px;
    }
`;

export default TokenNavFooter;
