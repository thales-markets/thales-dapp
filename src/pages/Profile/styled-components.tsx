import { ScreenSizeBreakpoint } from 'enums/ui';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow } from 'styles/common';

export const Container = styled(FlexDivColumn)`
    width: 100%;
    max-width: 974px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        ::-webkit-scrollbar {
            width: 5px;
        }
    }
`;

export const Header = styled(FlexDivRow)`
    width: 100%;
    align-items: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
    }
`;

export const Title = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 18px;
    font-weight: bold;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-bottom: 10px;
    }
`;

export const MainContainer = styled(FlexDivColumn)`
    width: 100%;
`;

export const Nav = styled.div`
    display: flex;
    justify-content: center;
    align-items: stretch;
    border-bottom: 4px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 3px;
    margin-bottom: 20px;
`;

export const NavItem = styled.p<{
    active?: boolean;
}>`
    font-weight: bold;
    line-height: 40px;
    font-size: 15px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
    cursor: pointer;
    padding: 0 50px;
    white-space: pre;
    box-shadow: ${(props) => (props.active ? `0px 4px ${props.theme.borderColor.quaternary};` : '')};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        line-height: 30px;
        font-size: 13px;
        padding: 0 20px;
    }
`;

export const Notification = styled.span`
    background: ${(props) => props.theme.button.background.primary};
    border-radius: 30px;
    color: ${(props) => props.theme.button.textColor.primary};
    margin-left: 8px;
    width: 24px;
    text-align: center;
    font-size: 18px;
    line-height: 24px;
    display: inline-block;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 13px;
        line-height: 20px;
        width: 20px;
        margin-left: 6px;
    }
`;

export const StatsContainer = styled(FlexDivRow)`
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    color: ${(props) => props.theme.textColor.primary};
    padding: 15px 15px;
    font-size: 18px;
    line-height: 24px;
    margin-top: 15px;
    margin-bottom: 15px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 10px 10px;
        flex-wrap: wrap;
        font-size: 13px;
        line-height: 18px;
    }
`;

export const StatsItem = styled(FlexDivCentered)`
    :not(:first-child) {
        border-left: 2px solid ${(props) => props.theme.borderColor.secondary};
    }
    width: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        :not(:first-child) {
            border-left: none;
        }
        width: 50%;
    }
`;

export const StatsLabel = styled.label`
    margin-right: 6px;
`;

export const StatsValue = styled.span<{ color?: string }>`
    color: ${(props) => props.color || props.theme.textColor.primary};
    font-weight: 700;
`;
