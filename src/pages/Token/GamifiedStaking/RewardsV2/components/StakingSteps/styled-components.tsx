import styled from 'styled-components';

export const HighlightText = styled.span`
    font-size: 13px;
    color: ${(props) => props.theme.textColor.quaternary};
`;

export const BoldedText = styled.span`
    font-size: 13px;
    font-weight: 700 !important;
`;

export const HighlightTextSecondary = styled(HighlightText)`
    color: ${(props) => props.theme.tokenPage.border.secondary};
`;

export const HighlightTextBigger = styled(HighlightTextSecondary)`
    font-size: 16px;
`;
