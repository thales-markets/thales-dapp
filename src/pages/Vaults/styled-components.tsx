import { ScreenSizeBreakpoint } from 'enums/ui';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivRow } from 'styles/common';

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

export const Title = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.primary};
    margin-top: 10px;
    margin-bottom: 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-top: 0px;
        margin-bottom: 15px;
    }
`;
