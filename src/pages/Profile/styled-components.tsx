import { ScreenSizeBreakpoint } from 'enums/ui';
import styled from 'styled-components';
import { FlexDivRow } from 'styles/common';

export const Container = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    margin-top: 50px;
    max-width: 974px;
    flex-direction: row;
    @media (max-width: 1250px) {
        margin-top: 0;
        flex-direction: column-reverse;
    }
    *::-webkit-scrollbar-track {
        border-radius: 8px;
    }
`;

export const ContainerFixed = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    max-width: 400px;
    top: -40px;
    @media (max-width: 1250px) {
        display: none;
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
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-top: 20px;
        justify-content: space-between;
    }
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
        font-size: 14px;
        padding: 0 20px;
    }
    @media (max-width: 500px) {
        font-size: 10px;
    }
`;

export const Notification = styled.span`
    background: ${(props) => props.theme.button.background.primary};
    box-sizing: border-box;
    border-radius: 30px;
    color: ${(props) => props.theme.button.textColor.primary};
    margin-left: 20px;
    width: 28px;
    text-align: center;
    font-size: 18px;
    line-height: 28px;
    position: relative;
    top: 0px;
    display: inline-block;
    @media (max-width: 512px) {
        font-size: 12px;
        line-height: 20px;
        width: 22px;
        margin-left: 10px;
    }
`;

export const ContentWrapper = styled.div<{ isScrollable?: boolean }>`
    width: calc(100% + 80px);
    overflow: hidden;
    overflow-y: auto;
    position: relative;
    left: -50px;
    margin-top: 10px;
    padding-left: 50px;
    padding-right: 20px;
    height: 100%;
    min-height: 300px;
    ${(props) => (props.isScrollable ? 'max-height: 400px;' : '')}
`;

export const PriceContainer = styled.div`
    display: block;
    box-sizing: border-box;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    margin-top: 20px;
`;

export const StatsContainer = styled(FlexDivRow)`
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    color: ${(props) => props.theme.textColor.primary};
    padding: 20px 15px;
    font-size: 18px;
`;

export const StatsItem = styled(FlexDivRow)``;

export const StatsLabel = styled.span`
    margin-right: 6px;
`;

export const StatsValue = styled.span<{ color?: string }>`
    color: ${(props) => props.color || props.theme.textColor.primary};
    font-weight: 700;
`;
