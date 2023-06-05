import { ScreenSizeBreakpoint } from 'enums/ui';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivRow } from 'theme/common';

export const Wrapper = styled(FlexDivColumn)`
    width: 100%;
    align-items: center;
    color: ${(props) => props.theme.textColor.primary};
`;

export const Container = styled(FlexDivRow)`
    width: 100%;
    position: relative;
    align-items: start;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 95%;
        flex-direction: column;
        align-items: center;
    }
`;
