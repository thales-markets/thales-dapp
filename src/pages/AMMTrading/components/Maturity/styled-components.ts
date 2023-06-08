import styled from 'styled-components';
import { CSSProperties } from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow, FlexDivSpaceBetween } from 'styles/common';

export const Container = styled(FlexDivColumn)`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    color: ${(props) => props.theme.textColor.primary};
    border-radius: 8px;
    width: 100%;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    padding: 20px 20px;
`;

export const Header = styled(FlexDivColumn)`
    color: ${(props) => props.theme.textColor.primary};
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
    width: 100%;
    padding: 4px 10px;
    font-weight: 600;
    font-size: 13px;
    line-height: 20px;
    margin-bottom: 6px;
    text-transform: uppercase;
    text-align: center;
`;

export const Label = styled.span`
    text-transform: uppercase;
    margin-bottom: 30px;
`;

export const PositionsContainer = styled(FlexDivRow)`
    margin-bottom: 30px;
    gap: 10px;
`;

export const Position = styled(FlexDivSpaceBetween)<{ isDisabled: boolean; color: string }>`
    height: 34px;
    color: ${(props) => props.color};
    border: 1px solid ${(props) => props.color};
    border-radius: 8px;
    opacity: ${(props) => (props.isDisabled ? '0.5' : '1')};
    width: 100%;
    padding: 0 15px;
`;

export const InfoContainer = styled(FlexDivColumn)`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
    padding: 10px 15px;
    line-height: 20px;
`;

export const InfoItem = styled(FlexDivSpaceBetween)``;

export const InfoLabel = styled.span`
    color: ${(props) => props.theme.textColor.secondary};
`;
export const Info = styled.span`
    color: ${(props) => props.theme.textColor.quaternary};
`;

export const LoaderContainer = styled(FlexDivCentered)`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
    position: relative;
    min-height: 220px;
    width: 100%;
`;
export const additionalButtonStyle: CSSProperties = {
    border: 'none',
};
