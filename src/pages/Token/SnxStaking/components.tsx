import { ScreenSizeBreakpoint } from 'constants/ui';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';

export const EarnSection = styled.section<{
    orderOnMobile?: number;
    orderOnTablet?: number;
    paddingOnMobile?: number;
    spanOnTablet?: number;
}>`
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background: ${(props) => props.theme.background.primary};
    color: ${(props) => props.theme.textColor.primary};
    grid-column: span 5;
    grid-row: span 3;
    padding: 10px;
    max-width: 100%;
    @media screen and (max-width: 1024px) {
        grid-column: span ${(props) => props.spanOnTablet ?? 10} !important;
        order: ${(props) => props.orderOnTablet ?? 10};
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        grid-column: span 10 !important;
        order: ${(props) => props.orderOnMobile ?? 10};
        padding: ${(props) => props.paddingOnMobile ?? 15}px;
    }
`;

export const SectionHeader = styled(FlexDivRowCentered)`
    font-weight: 600;
    font-size: 18px;
    letter-spacing: 0.15px;
    color: ${(props) => props.theme.textColor.primary};
    min-height: 50px;
    padding: 0px 20px 0 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 16px;
        padding: 0px 5px;
        min-height: 25px;
        margin-bottom: 10px;
        flex-direction: column;
        align-items: start;
    }
`;

export const SectionContentContainer = styled(FlexDivColumn)`
    padding: 20px 20px 0 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 0 5px 0 5px;
    }
`;

export const ButtonContainer = styled(FlexDivColumnCentered)`
    margin-top: 10px;
    align-items: center;
`;

export const ButtonContainerBottom = styled(ButtonContainer)`
    justify-content: flex-end;
`;

export const ClaimMessage = styled.div<{ invisible?: boolean; color?: string }>`
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: ${(props) => (props.color ? props.color : props.theme.warning.textColor.primary)};
    margin-top: 10px;
    visibility: ${(props) => (props.invisible ? 'hidden' : 'visible')};
`;
