import styled from 'styled-components';
import { FlexDivColumnCentered } from 'theme/common';

export const FooterIcon = styled.img`
    width: 30px;
    height: 30px;
    margin: 60px;
`;

export const PoweredBy = styled.div`
    align-self: start;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #f6f6fe;
    white-space: nowrap;
    margin: 60px;
`;

export const SyntetixLogo = styled.img`
    width: 220px;
    height: 16px;
    position: relative;
    top: 2px;
`;

export const VerticalWrapper = styled(FlexDivColumnCentered)`
    align-items: center;
    width: min(100%, 1440px);
    margin: auto;
`;
