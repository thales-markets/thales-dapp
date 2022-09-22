import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';

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
    background: #04045a;
    border-radius: 15px;
    color: white;
    grid-column: span 5;
    grid-row: span 3;
    border: 1px solid rgba(100, 217, 254, 0.6);
    padding: 10px;
    max-width: 100%;
    @media screen and (max-width: 1024px) {
        grid-column: span ${(props) => props.spanOnTablet ?? 10} !important;
        order: ${(props) => props.orderOnTablet ?? 10};
    }
    @media (max-width: 767px) {
        grid-column: span 10 !important;
        order: ${(props) => props.orderOnMobile ?? 10};
        padding: ${(props) => props.paddingOnMobile ?? 15}px;
    }
`;

export const SectionHeader = styled(FlexDivRowCentered)`
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    min-height: 50px;
    padding: 0px 20px 0 20px;
    @media (max-width: 767px) {
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
    @media (max-width: 767px) {
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
    color: ${(props) => (props.color ? props.color : '#ffcc00')};
    margin-top: 10px;
    visibility: ${(props) => (props.invisible ? 'hidden' : 'visible')};
`;

export const StyledInfoIcon = styled(InfoIcon)`
    min-width: 20px;
    min-height: 20px;
    margin-left: 10px;
    margin-bottom: -2px;
`;
