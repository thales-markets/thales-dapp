import { ScreenSizeBreakpoint } from 'enums/ui';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivRow } from 'styles/common';

export const Container = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    max-width: 974px;
    flex-direction: column;
`;

export const ContainerFixed = styled(FlexDivRow)`
    width: 100%;
    align-items: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
    }
`;

export const ContainerLeft = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const ContainerRight = styled.div<{ layout: boolean }>`
    flex: 1;
    display: flex;
    flex-direction: ${(props) => (props.layout ? 'column' : 'row-reverse')};
    padding-left: ${(props) => (props.layout ? '80px' : '0')};
    max-width: ${(props) => (props.layout ? '50%' : '100%')};
    align-items: center;
    & > div:nth-child(2) {
        margin: ${(props) => (props.layout ? '' : '0 20px')};
    }
    @media (max-width: 1250px) {
        max-width: 100%;
        flex-direction: row;
        padding-left: 0;
    }
`;

export const Wrapper = styled.div`
    display: block;
    box-sizing: border-box;
    border-radius: 15px;
    padding: 18px 32px;
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    @media (max-width: 1250px) {
        margin-left: 40px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 8px;
        margin-left: 20px;
    }

    @media (max-width: 500px) {
        padding: 8px;
        margin-left: 10px;
    }
`;

export const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    max-width: 500px;
    width: 100%;
`;

const Text = styled.span`
    display: block;
    color: ${(props) => props.theme.textColor.primary};
    font-size: 18px;
    line-height: 24px;
`;

export const Label = styled(Text)`
    font-weight: 400;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 12px;
    }
`;

export const Value = styled(Text)<{ color?: string }>`
    color: ${(props) => props.color ?? 'none'};
    font-weight: 700;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 16px;
    }
    @media (max-width: 500px) {
        font-size: 14px;
    }
`;

export const Nav = styled.div<{ justifyContent: string }>`
    display: flex;
    justify-content: center;
    align-items: stretch;
    border-bottom: 4px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 3px;
    margin-bottom: 20px;
`;

export const NavItem = styled.p`
    font-weight: bold;
    line-height: 40px;
    font-size: 15px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
    cursor: pointer;
    padding: 0 50px;
    white-space: pre;
    &.active {
        box-shadow: 0px 4px ${(props) => props.theme.borderColor.quaternary};
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        line-height: 30px;
        font-size: 12px;
        padding: 0 20px;
    }
`;

export const Notification = styled.span`
    background: ${(props) => props.theme.button.background.primary};
    box-sizing: border-box;
    border-radius: 30px;
    color: ${(props) => props.theme.button.textColor.primary};
    margin-left: 10px;
    width: 24px;
    text-align: center;
    font-size: 18px;
    line-height: 24px;
    position: relative;
    top: 0px;
    display: inline-block;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 12px;
        line-height: 20px;
        width: 22px;
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
