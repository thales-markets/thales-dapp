import { ScreenSizeBreakpoint } from 'constants/ui';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn } from 'theme/common';

export const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
        margin-bottom: 20px;
    }
`;

export const Label = styled.span`
    font-size: 15px;
    line-height: 18px;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 6px;
    text-transform: uppercase;
`;

export const StatisticsWrapper = styled.div`
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    padding: 16px 32px;
    border-radius: 15px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
        margin-bottom: 20px;
    }
`;

export const KeyValue = styled.span`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const StatLabel = styled.span<{ color?: string }>`
    font-size: 21px;
    line-height: 25px;
    color: ${(props) => props.color || props.theme.textColor.primary};
`;

export const StatValue = styled(StatLabel)<{ color?: string }>`
    font-weight: 700;
    color: ${(props) => props.color || props.theme.textColor.primary};
    padding-left: 100px;
    text-align: right;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding-left: 0px;
    }
`;

export const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 31px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        justify-content: center;
        margin-bottom: 0;
    }
`;

export const DescriptionContainer = styled.div`
    color: ${(props) => props.theme.textColor.primary};
    display: block;
    width: 40%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
        margin-bottom: 20px;
    }
`;

export const Text = styled.p<{ height?: string }>`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 16px;
    line-height: 18px;
    height: ${(props) => props.height || ''};
    transition: height 0.3s ease-out;
    overflow: hidden;
`;

export const TableWrapper = styled(FlexDivColumn)`
    width: 100%;
    align-items: center;
    margin-bottom: 100px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-bottom: 10px;
    }
`;

export const RowContrainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 7px 0;
`;

export const MenuContainer = styled(FlexDiv)`
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    border-bottom: 4px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 3px;
    margin-bottom: 15px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

export const Tab = styled.div`
    width: 100%;
    display: flex;
`;

export const MenuItem = styled.div<{
    active?: boolean;
}>`
    text-align: center;
    color: ${(props) => (props.active ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
    box-shadow: ${(props) => (props.active ? `0px 4px ${props.theme.borderColor.quaternary};` : '')};
    text-transform: uppercase;
    padding: 15px 30px;
    cursor: pointer;
`;

export const BoldText = styled.span`
    font-weight: 900;
`;

export const ReferralFooter = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
    font-size: 16px;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-top: 50px;
        margin-bottom: 10px;
        display: inline-block;
        div {
            display: inline;
        }
    }
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
        margin: 10px;
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
        top: -44px;
        z-index: 2;
    }
`;

export const ViewTitle = styled.p`
    font-weight: bold;
    font-size: 12px;
    line-height: 100%;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.secondary};
    @media (min-width: ${ScreenSizeBreakpoint.SMALL}px) {
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

export const StyledLink = styled.a`
    color: ${(props) => props.theme.link.textColor.secondary};
    &:hover {
        text-decoration: underline;
    }
`;

export const FooterLink = styled.a`
    color: ${(props) => props.theme.link.textColor.primary};
    &:hover {
        text-decoration: underline;
    }
`;
