import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDivRow, FlexDivCentered, FlexDivRowCentered } from 'theme/common';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { getStatusColor } from 'utils/governance';
import { ScreenSizeBreakpoint } from 'constants/ui';

export const Container = styled(FlexDivColumnCentered)`
    padding: 10px 40px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        padding: 10px 20px;
    }
`;

export const StatusContainer = styled(FlexDivColumnCentered)`
    margin-bottom: 30px;
    align-items: center;
`;

export const Title = styled(FlexDivColumnCentered)`
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 40px;
`;

export const DetailsWrapper = styled(FlexDivRow)`
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        flex-direction: column;
    }
`;

export const DetailsContainer = styled(FlexDivColumnCentered)`
    padding: 15px;
    border-radius: 5px;
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    color: ${(props) => props.theme.textColor.primary};
    &:first-child {
        margin-right: 40px;
        @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
            flex-direction: column;
            margin-right: 0px;
            margin-bottom: 10px;
        }
    }
`;

export const Label = styled.span`
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: ${(props) => props.theme.textColor.secondary};
    margin-bottom: 5px;
`;

export const Text = styled.span`
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
`;

export const StatusWrapper = styled(FlexDivCentered)<{ status: string }>`
    padding: 1px;
    border-radius: 8px;
    width: 200px;
    background: ${(props) => getStatusColor(props.status)};
`;

export const Status = styled(FlexDivColumnCentered)<{ status: string }>`
    height: 48px;
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 2px;
    color: ${(props) => getStatusColor(props.status)};
    background: ${(props) => props.theme.background.primary};
    border-radius: 8px;
    text-transform: uppercase;
    width: 198px;
`;

export const Body = styled(FlexDivColumn)`
    margin-top: 15px;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: ${(props) => props.theme.textColor.primary};
    p {
        margin-bottom: 15px;
    }
    a {
        color: ${(props) => props.theme.link.textColor.primary};
        &:hover {
            text-decoration: underline;
        }
    }
    table {
        overflow-y: auto;
        display: block;
        th,
        td {
            border: 1px solid ${(props) => props.theme.borderColor.primary};
            padding: 6px 13px;
        }
    }
    h2 {
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        color: ${(props) => props.theme.textColor.primary};
        margin-top: 24px;
        margin-bottom: 16px;
    }
`;

export const VoteHeader = styled(FlexDivRowCentered)`
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        flex-direction: column;
        align-items: start;
    }
`;

export const VoteNote = styled(FlexDivRow)`
    font-weight: 300;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: ${(props) => props.theme.textColor.quaternary};
    text-transform: uppercase;
    margin-top: 42px;
    margin-left: 5px;
`;

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
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        margin-top: 0;
    }
`;

export const Divider = styled.hr`
    width: 100%;
    border: none;
    border-top: 1px solid ${(props) => props.theme.borderColor.primary};
`;

export const ArrowIcon = styled(ArrowHyperlinkIcon)`
    width: 10px;
    height: 10px;
    margin-left: 4px;
`;
