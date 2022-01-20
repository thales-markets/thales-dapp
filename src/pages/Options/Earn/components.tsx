import styled from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivColumn, FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';
import { withStyles } from '@material-ui/core';
import MaterialTooltip from '@material-ui/core/Tooltip';
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
    margin-bottom: 15px;
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
    letter-spacing: 0.5px;
    color: #f6f6fe;
    min-height: 50px;
    padding: 0px 20px 0 20px;
    @media (max-width: 767px) {
        font-size: 16px;
        padding: 0px 5px 0 10px;
        min-height: 35px;
    }
`;

export const SectionContent = styled(FlexDiv)`
    padding: 30px 30px 15px 30px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
`;

export const ClaimDiv = styled(FlexDiv)`
    align-items: center;
`;

export const ClaimTitle = styled.span`
    font-size: 17px;
    font-weight: 600;
    letter-spacing: 0.15px;
    padding-bottom: 20px;
    @media (max-width: 767px) {
        font-size: 16px;
    }
`;

export const ClaimContent = styled.span`
    font-size: 16px;
`;

export const SectionContentContainer = styled(FlexDivColumn)`
    padding: 20px 20px 0 20px;
    @media (max-width: 767px) {
        padding: 0 5px 0 5px;
    }
`;

export const ClaimItem = styled(FlexDivColumnCentered)`
    margin-bottom: 20px;
    align-items: center;
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

export const FullRow = styled(FlexDiv)`
    flex-basis: 100%;
    display: flex;
    font-size: 20px;
    justify-content: center;
    margin-bottom: 10px;
`;

export const EarnSymbol = styled(FlexDivCentered)`
    color: #00f9ff;
    font-weight: 600;
    font-size: 39px;
    padding: 20px;
`;

export const PieChartContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

export const PieChartCenterDiv = styled.div`
    position: absolute;
    top: 44%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
`;

export const PieChartCenterText = styled.span<{ disabled?: boolean }>`
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.25px;
    max-width: 200px;
    white-space: break-spaces;
    text-align: center;
    margin-bottom: 5px;
    color: ${(props) => (props.disabled ? '#B8C6E5' : 'white')};
`;

export const LearnMore = styled.span<{ top: string }>`
    position: absolute;
    bottom: 18%;
    left: 50%;
    transform: translate(-50%, 0);
    color: #f6f6fe;
    font-size: 14px;
    line-height: 24px;
    cursor: pointer;
    z-index: 101;
    height: 20px;
    @media (max-width: 767px) {
        top: ${(props) => props.top};
    }
`;

export const StyledMaterialTooltip = withStyles(() => ({
    arrow: {
        '&:before': {
            border: '1px solid #00D1FF',
        },
        color: '#04045A',
    },
    tooltip: {
        background: 'linear-gradient(281.48deg, #04045A -16.58%, #141874 97.94%)',
        borderRadius: '23px',
        border: '1px solid #00D1FF',
        padding: '20px',
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.4px',
        color: '#F6F6FE',
        maxWidth: window.innerWidth < 768 ? 350 : 700,
    },
}))(MaterialTooltip);

export const MaxButtonContainer = styled(FlexDiv)`
    justify-content: flex-end;
    flex: 1;
    margin-left: 10px;
    max-width: 40%;
`;

export const MaxButton = styled.button`
    background: #04045a;
    border: 3px solid #0c1c68;
    box-sizing: border-box;
    border-radius: 5px;
    color: #f6f6fe;
    cursor: pointer;
    font-size: 16px;
    padding: 12px 32px 12px 32px;
    text-transform: uppercase;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

export const TooltipLink = styled.a`
    color: #00f9ff;
    &:hover {
        color: rgb(116, 139, 198);
    }
`;

export const StyledInfoIcon = styled(InfoIcon)`
    min-width: 20px;
    min-height: 20px;
    margin-left: 10px;
    margin-bottom: -2px;
    @media (max-width: 1024px) {
        display: none;
    }
`;
