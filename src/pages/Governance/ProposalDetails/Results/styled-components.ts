import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDiv } from 'theme/common';

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

export const RowPercentageContainer = styled.div`
    position: relative;
`;

export const RowPercentage = styled.div`
    height: 3px;
    border: 1px solid ${(props) => props.theme.borderColor.primary};
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
