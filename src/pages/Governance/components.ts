import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDiv, FlexDivRow } from 'theme/common';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { StatusEnum } from 'constants/governance';
import { DefaultSubmitButton } from 'pages/Options/Market/components';

export const SidebarTitle = styled(FlexDivColumnCentered)`
    font-weight: 500;
    font-size: 25px;
    line-height: 48px;
    color: #f6f6fe;
    margin-bottom: 15px;
    text-align: center;
`;

export const SidebarContentWrapper = styled(FlexDivColumn)`
    background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
    padding: 1px 0 0 0;
    border-radius: 0 0 5px 5px;
`;

export const SidebarContentScrollWrapper = styled(FlexDivColumn)<{ maxHeight?: number }>`
    max-height: ${(props) => (props.maxHeight ? props.maxHeight : 490)}px;
    overflow: auto;
    border-radius: 0 0 5px 5px;
`;

export const SidebarContent = styled(FlexDivColumn)<{ type?: string }>`
    padding: ${(props) => (props.type === 'results' ? '10px 0 20px 0' : '0')};
    background-color: #04045a;
    border-radius: 0 0 5px 5px;
`;

export const ResultRow = styled(FlexDivColumnCentered)<{
    backgroundColor?: string;
    opacity?: number;
    borderColor?: string;
    paddingBottom?: number;
    paddingTop?: number;
}>`
    padding: 10px 20px;
    background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : '#04045a')};
    opacity: ${(props) => (props.opacity ? props.opacity : 1)};
    border-bottom: ${(props) => (props.borderColor ? `1px solid ${props.borderColor}` : 'none')};
    padding-bottom: ${(props) => (props.paddingBottom ? props.paddingBottom : '10')}px;
`;

export const VoteRow = styled(FlexDivColumnCentered)`
    padding: 10px;
    border-bottom: 1px solid #2d3079;
`;

export const SidebarRowData = styled(FlexDivRow)`
    font-weight: bold;
    font-size: 16px;
    line-height: 36px;
    color: #f6f6fe;
`;

export const Percentage = styled(FlexDiv)`
    text-align: right;
`;

export const RowPercentage = styled.div`
    height: 3px;
    border: 1px solid #4564ae;
    border-radius: 10px;
    background-color: #4564ae;
`;

export const RowPercentageIndicator = styled(FlexDiv)<{ width: number }>`
    height: 5px;
    background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
    width: ${(props) => `${props.width}%`};
    position: absolute;
    border-radius: 10px;
    top: -1px;
    left: 0;
    z-index: 1;
`;

export const ResultLabel = styled.div`
    width: 140px;
`;

export const VoteLabel = styled.div`
    width: 125px;
`;

export const Votes = styled.div``;

export const LoaderContainer = styled(FlexDivColumn)`
    min-height: 400px;
    background: #04045a;
    justify-content: space-evenly;
    position: relative;
`;

export const NoVotes = styled(FlexDivColumn)`
    min-height: 200px;
    background: #04045a;
    justify-content: space-evenly;
    align-items: center;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: #f6f6fe;
`;

export const Blockie = styled.img`
    width: 20px;
    height: 20px;
    border-radius: 12px;
    margin-right: 6px;
`;

export const StyledLink = styled.a`
    color: #f6f6fe;
    &path {
        fill: #f6f6fe;
    }
    &:hover {
        color: #00f9ff;
        & path {
            fill: #00f9ff;
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
            return '#748BC6';
        case StatusEnum.Closed:
            return '#8208FC';
        default:
            return '#64D9FE';
    }
};

export const DetailsTitle = styled(FlexDivRow)`
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: #ffffff;
    margin-bottom: 5px;
    margin-top: 40px;
`;

export const Divider = styled.hr`
    width: 100%;
    border: none;
    border-top: 1px solid #748bc6;
`;

export const VoteContainer = styled(FlexDivColumnCentered)`
    margin-top: 15px;
`;

export const VoteButton = styled(DefaultSubmitButton)`
    margin-top: 20px;
    margin-bottom: 20px;
    width: 264px;
    height: 48px;
`;

export const VoteConfirmation = styled(FlexDiv)`
    font-weight: bold;
    font-size: 16px;
    line-height: 34px;
    color: #f6f6fe;
    padding: 0 10px;
    justify-content: center;
`;
