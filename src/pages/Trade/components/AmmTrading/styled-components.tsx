import styled from 'styled-components';
import { FlexDivRowCentered } from 'theme/common';

export const DetailsRow = styled(FlexDivRowCentered)<{ margin?: string; padding?: string }>`
    margin: ${(props) => props.margin || '0'};
    padding: ${(props) => props.padding || '2px 0'};
`;

export const Text = styled.span`
    font-weight: 700;
    font-size: 13px;
    line-height: 15px;
`;

export const TextLabel = styled(Text)`
    color: ${(props) => props.theme.textColor.secondary};
`;
export const TextValue = styled(Text)<{ isProfit?: boolean; uppercase?: boolean }>`
    color: ${(props) => (props.isProfit ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
    text-transform: ${(props) => (props.uppercase ? 'uppercase;' : 'initial')};
`;
