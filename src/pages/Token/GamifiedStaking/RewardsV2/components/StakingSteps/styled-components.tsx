import styled from 'styled-components';

export const HighlightText = styled.span`
    font-size: 13px;
    color: ${(_props) => _props.theme.textColor.quaternary};
`;

export const BoldedText = styled.span`
    font-size: 13px;
    font-weight: 700 !important;
`;

export const HighlightTextSecondary = styled(HighlightText)`
    color: ${(_props) => _props.theme.tokenPage.border.secondary};
`;
