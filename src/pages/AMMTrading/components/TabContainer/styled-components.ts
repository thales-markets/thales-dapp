import { ScreenSizeBreakpoint } from 'enums/ui';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';

export const MenuContainer = styled(FlexDiv)<{
    justifyContent?: string;
}>`
    font-size: 13px;
    width: 100%;
    flex-direction: row;
    justify-content: ${(props) => props.justifyContent || 'stretch'};
    align-items: stretch;
    border-bottom: 4px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 3px;
    margin-bottom: 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

export const Container = styled(FlexDiv)`
    max-width: 600px;
    flex-direction: column;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-width: initial;
        width: 100%;
    }
`;

export const Tab = styled.div`
    width: 100%;
    display: flex;
`;

export const MenuItem = styled.div<{
    active?: boolean;
    noStrech?: boolean;
}>`
    text-align: center;
    ${(props) => (!props.noStrech ? 'flex: 1' : '')};
    color: ${(props) => (props.active ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
    box-shadow: ${(props) => (props.active ? `0px 4px ${props.theme.borderColor.quaternary};` : '')};
    text-transform: uppercase;
    padding: 10px 5px 8px 5px;
    cursor: pointer;
`;

export const ViewButton = styled.div`
    display: none;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: block;
        align-self: center;
        padding: 6px 20px;
        border: 1px solid ${(props) => props.theme.button.borderColor.tertiary};
        box-sizing: border-box;
        border-radius: 30px;
        background: ${(props) => props.theme.button.background.tertiary};
        font-weight: bold;
        font-size: 12px;
        line-height: 10px;
        text-transform: uppercase;
        color: ${(props) => props.theme.button.textColor.secondary};
        margin: 20px 10px;
    }
`;

export const ViewsDropDownWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 0;
    z-index: 2;
`;

export const ViewsDropDown = styled.div`
    display: none;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: flex;
        flex-direction: column;
        background: ${(props) => props.theme.background.secondary};
        border: 1px solid ${(props) => props.theme.borderColor.primary};
        box-sizing: border-box;
        border-radius: 12px;
        padding: 15px 20px;
        max-width: 240px;
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        text-align: center;
        top: -54px;
        z-index: 2;
    }
`;

export const ViewTitle = styled.p`
    font-weight: bold;
    font-size: 12px;
    line-height: 100%;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.secondary};
    @media (min-width: 768px) {
        display: none;
    }
    margin-bottom: 10px;
`;

export const ViewItem = styled.div<{ active: boolean }>`
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-weight: bold;
        font-size: 12px;
        line-height: 18px;
        text-transform: uppercase;
        cursor: pointer;
        color: ${(props) => (props.active ? props.theme.textColor.quaternary : props.theme.button.textColor.secondary)};
    }
`;

export default Container;
