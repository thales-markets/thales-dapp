import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { ScreenSizeBreakpoint } from 'enums/ui';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';

export const Container = styled(FlexDivColumnCentered)`
    padding-top: 30px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding-top: 10px;
    }
`;

export const HeaderContainer = styled(FlexDivRowCentered)`
    margin: 0 30px 20px 30px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        margin: 0 0 20px 0;
    }
`;

export const TableContainer = styled(FlexDivColumn)`
    position: relative;
    align-items: center;
    padding: 0 30px;
    width: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 0;
    }
`;

export const Info = styled.div`
    font-weight: bold;
    font-size: 18px;
    line-height: 24px;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-left: 0;
        margin-bottom: 10px;
    }
`;
export const Address = styled.span`
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 12px;
    }
`;

export const Amount = styled.span`
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 12px;
    }
`;

export const ArrowIcon = styled(ArrowHyperlinkIcon)`
    width: 12px;
    height: 12px;
    margin-left: 4px;
    margin-top: 5px;
`;
