import { ScreenSizeBreakpoint } from 'constants/ui';
import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';

export const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 20px;
    margin-top: 20px;
    padding: 0 20px 0 0;
    max-height: 1000px;
    overflow: auto;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 0;
        max-height: initial;
        overflow: initial;
    }
`;

export const NoProposals = styled(FlexDivColumn)`
    margin-top: 30px;
    min-height: 300px;
    background: ${(props) => props.theme.background.primary};
    justify-content: space-evenly;
    align-items: center;
    align-self: center;
    border-radius: 5px;
`;

export const NoProposalsText = styled.p`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 20px;
    font-weight: bold;
`;
