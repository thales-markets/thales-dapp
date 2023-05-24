import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDiv, FlexDivRow, FlexDivCentered } from 'theme/common';
import { ReactComponent as ArrowBackIcon } from 'assets/images/arrow-back.svg';

export const Container = styled(FlexDivRow)`
    width: 100%;
    @media (max-width: 1200px) {
        flex-direction: column;
    }
`;

export const MainContentContainer = styled.div<{ isOverviewPage: boolean }>`
    background: ${(props) => (props.isOverviewPage ? 'transparent' : props.theme.background.secondary)};
    width: 66%;
    padding: 2px;
    border-radius: 15px;
    height: 100%;
    @media (max-width: 1200px) {
        width: 100%;
    }
    @media (max-width: 767px) {
        border: none;
        background: ${(props) => (props.isOverviewPage ? 'transparent' : props.theme.background.secondary)};
    }
`;

export const MainContentWrapper = styled.div<{ isOverviewPage: boolean }>`
    border-radius: 15px;
    padding: ${(props) => (props.isOverviewPage ? '0px' : '25px 0px 30px 0px')};
    background: ${(props) => props.theme.background.primary};
    @media (max-width: 767px) {
        background: ${(props) => (props.isOverviewPage ? 'transparent' : props.theme.background.primary)};
        padding: ${(props) => (props.isOverviewPage ? '0px 0px 10px 0px' : '25px 0px 30px 0px')};
    }
`;

export const SidebarContainer = styled(FlexDivColumn)`
    width: 33%;
    margin-left: 10px;
    @media (max-width: 1200px) {
        width: 100%;
        margin-left: 0;
    }
`;

export const SidebarWrapper = styled.div`
    background: ${(props) => props.theme.background.secondary};
    border-radius: 15px;
    padding: 2px;
    margin-bottom: 20px;
    &:first-child {
        @media (max-width: 1200px) {
            margin-top: 20px;
        }
    }
`;

export const Sidebar = styled.div`
    background: ${(props) => props.theme.background.primary};
    border-radius: 15px;
    padding: 15px 0px 0px 0px;
`;

export const OptionsTabWrapper = styled(FlexDivRow)`
    padding: 0 30px;
    @media (max-width: 767px) {
        flex-direction: column;
        padding: 0;
    }
`;

export const OptionsTabContainer = styled(FlexDiv)`
    height: 40px;
`;

export const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean; index: number }>`
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 48px;
    color: ${(props) => props.theme.textColor.primary};
    user-select: none;
    border-bottom: 5px solid ${(props) => props.theme.background.primary};
    margin-left: 25px;
    margin-right: 25px;
    &.selected {
        transition: 0.2s;
        color: ${(props) => props.theme.textColor.primary};
        border-bottom: 5px solid ${(props) => props.theme.borderColor.quaternary};
    }
    &:hover:not(.selected) {
        cursor: pointer;
        color: ${(props) => props.theme.textColor.quaternary};
    }
`;

export const BackLinkWrapper = styled(FlexDiv)<{ isOverviewPage: boolean }>`
    height: 20px;
    align-self: start;
    margin-bottom: 10px;
    @media (max-width: 767px) {
        height: ${(props) => (props.isOverviewPage ? '0' : '20px')};
    }
`;

export const BackLink = styled(FlexDivCentered)`
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;
    color: ${(props) => props.theme.link.textColor.secondary};
    &path {
        fill: ${(props) => props.theme.link.textColor.secondary};
    }
    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;

export const ArrowIcon = styled(ArrowBackIcon)`
    height: 16px;
    width: 18px;
    margin-right: 4px;
    margin-left: 4px;
`;

export const SidebarTitle = styled(FlexDivCentered)`
    font-weight: 500;
    font-size: 25px;
    line-height: 48px;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 15px;
    text-align: center;
`;

export const SidebarContentWrapper = styled(FlexDivColumn)`
    background: ${(props) => props.theme.background.secondary};
    padding: 1px 0 0 0;
    border-radius: 0 0 15px 15px;
    height: 100%;
`;

export const SidebarContent = styled(FlexDivColumn)<{ type?: string; isCouncilVoting?: boolean }>`
    padding: ${(props) =>
        props.type === 'results' && !props.isCouncilVoting
            ? '10px 0 20px 0'
            : props.isCouncilVoting && props.type === 'results'
            ? '0 0 10px 0'
            : '0'};
    background: ${(props) => props.theme.background.primary};
    border-radius: 0 0 15px 15px;
`;

export const SidebarRowData = styled(FlexDivRow)<{ fontWeight?: number }>`
    font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 600)};
    font-size: 16px;
    line-height: 36px;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: 575px) {
        font-size: 14px;
    }
`;

export const Percentage = styled(FlexDiv)`
    text-align: right;
`;

export const Votes = styled.div``;

export const LoaderContainer = styled(FlexDivColumn)<{ height?: number }>`
    min-height: ${(props) => (props.height ? props.height : 400)}px;
    background: ${(props) => props.theme.background.primary};
    justify-content: space-evenly;
    position: relative;
    border-radius: 15px;
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const Blockie = styled.img`
    width: 20px;
    height: 20px;
    border-radius: 12px;
    margin-right: 6px;
`;

export const StyledLink = styled.a`
    color: ${(props) => props.theme.link.textColor.secondary};
    &path {
        fill: ${(props) => props.theme.link.textColor.secondary};
    }
    &:hover {
        text-decoration: underline;
    }
`;

export const VoteContainer = styled(FlexDivColumnCentered)`
    margin-top: 15px;
`;

export const VoteConfirmation = styled(FlexDiv)`
    font-weight: bold;
    font-size: 16px;
    line-height: 34px;
    color: ${(props) => props.theme.textColor.primary};
    padding: 0 10px;
    justify-content: center;
`;

export const ViewMore = styled(FlexDivCentered)<{ padding?: string }>`
    width: 100px;
    padding: ${(props) => (props.padding ? props.padding : '10px')};
    font-weight: normal;
    font-size: 16px;
    line-height: 36px;
    color: ${(props) => props.theme.link.textColor.secondary};
    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;

export const VotesCount = styled(FlexDivColumnCentered)`
    font-weight: 500;
    font-size: 20px;
    line-height: 48px;
    color: ${(props) => props.theme.button.textColor.primary};
    margin-bottom: 12px;
    text-align: center;
    background: ${(props) => props.theme.button.background.primary};
    border-radius: 9999px;
    height: 30px;
    min-width: 30px;
    padding: 8px;
    margin-left: 8px;
`;
