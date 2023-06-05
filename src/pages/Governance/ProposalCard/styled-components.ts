import { StatusEnum } from 'enums/governance';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { getStatusColor } from 'utils/governance';

export const CardContainer = styled(FlexDivColumnCentered)`
    width: 100%;
    position: relative;
    background: ${(props) => props.theme.background.secondary};
    min-height: 200px;
    padding: 2px;
    border-radius: 15px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    align-items: center;
    color: ${(props) => props.theme.textColor.primary};
    cursor: pointer;
    &:hover {
        background: ${(props) => props.theme.background.quaternary};
    }
`;

export const Card = styled.div`
    border-radius: 15px;
    background: ${(props) => props.theme.background.primary};
    width: 100%;
    height: 100%;
    padding: 20px;
`;

export const Status = styled(FlexDivCentered)<{ status: string }>`
    font-weight: bold;
    color: ${(props) => getStatusColor(props.status, props.theme)};
    text-transform: uppercase;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.5px;
    border: 2px solid ${(props) => getStatusColor(props.status, props.theme)};
    border-radius: 8px;
    padding: 0px 20px;
    height: 36px;
    text-align: center;
    margin-right: 20px;
`;

export const Title = styled(FlexDivRow)<{ status: string }>`
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    color: ${(props) =>
        props.status === StatusEnum.Closed ? props.theme.textColor.secondary : props.theme.textColor.primary};
    margin-top: 25px;
    margin-bottom: 25px;
`;

export const Body = styled(FlexDivRow)<{ status: string }>`
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: ${(props) =>
        props.status === StatusEnum.Closed ? props.theme.textColor.secondary : props.theme.textColor.primary};
`;

export const ResultContainer = styled.div`
    color: ${(props) => props.theme.textColor.secondary};
    text-align: right;
`;

export const Result = styled.span<{ color: string }>`
    color: ${(props) => props.color};
`;

export const RightSection = styled.div`
    text-align: right;
`;
