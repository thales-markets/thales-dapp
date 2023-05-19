import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDiv, FlexDivRow, FlexDivCentered, Colors } from 'theme/common';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { StatusEnum } from 'constants/governance';

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

export const ResultRow = styled(FlexDivColumnCentered)<{
    backgroundColor?: string;
    opacity?: number;
    borderColor?: string;
    paddingBottom?: number;
    paddingTop?: number;
}>`
    padding: 10px 20px;
    background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : props.theme.background.primary)};
    opacity: ${(props) => (props.opacity ? props.opacity : 1)};
    border-bottom: ${(props) => (props.borderColor ? `1px solid ${props.borderColor}` : 'none')};
    padding-bottom: ${(props) => (props.paddingBottom ? props.paddingBottom : '10')}px;
    border-radius: ${(props) => (props.borderColor ? 0 : 15)}px;
`;

export const VoteRow = styled(FlexDivColumnCentered)`
    padding: 10px;
    :not(:last-child) {
        border-bottom: 1px solid ${(props) => props.theme.borderColor.tertiary};
    }
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

export const RowPercentage = styled.div`
    height: 3px;
    border: 1px solid ${(props) => props.theme.borderColor.tertiary};
    border-radius: 10px;
    background-color: ${(props) => props.theme.background.secondary};
`;

export const RowPercentageIndicator = styled(FlexDiv)<{ width: number }>`
    height: 5px;
    background: linear-gradient(90deg, #36d1dc -1.48%, #5b86e5 102.44%);
    width: ${(props) => `${props.width}%`};
    position: absolute;
    border-radius: 10px;
    top: -1px;
    left: 0;
    z-index: 1;
`;

export const ResultLabel = styled.div`
    width: 160px;
    @media (max-width: 575px) {
        width: 140px;
    }
`;

export const VoteLabel = styled.div`
    width: 125px;
    @media (max-width: 575px) {
        width: 105px;
    }
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

export const NoVotes = styled(FlexDivColumn)`
    min-height: 200px;
    background: ${(props) => props.theme.background.primary};
    justify-content: space-evenly;
    align-items: center;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
    border-radius: 15px;
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
        color: ${(props) => props.theme.link.textColor.primary};
        & path {
            fill: ${(props) => props.theme.link.textColor.primary};
        }
    }
`;

export const ArrowIcon = styled(ArrowHyperlinkIcon)`
    width: 10px;
    height: 10px;
    margin-left: 4px;
`;

export const ArrowIconMedium = styled(ArrowHyperlinkIcon)`
    width: 12px;
    height: 12px;
    margin-left: 4px;
    margin-top: 5px;
`;

export const getColor = (status: string) => {
    switch (status) {
        case StatusEnum.Pending:
            return Colors.GRAY_LIGHT;
        case StatusEnum.Closed:
            return Colors.BLUE;
        default:
            return Colors.GREEN;
    }
};

export const DetailsTitle = styled(FlexDivRow)`
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 5px;
    margin-top: 40px;
`;

export const VotingPowerTitle = styled(DetailsTitle)`
    @media (max-width: 767px) {
        margin-top: 0;
    }
`;

export const Divider = styled.hr`
    width: 100%;
    border: none;
    border-top: 1px solid ${(props) => props.theme.borderColor.tertiary};
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
        color: ${(props) => props.theme.link.textColor.primary};
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
