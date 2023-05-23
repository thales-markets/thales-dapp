import styled, { StyledComponent } from 'styled-components';
import { FlexDiv, Image } from 'theme/common';

export const Wrapper = styled.div`
    width: auto;
    max-width: 1200px;
`;

export const MobileButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const WrapperForText = styled.div`
    width: auto;
    max-width: 700px;
    padding-left: 10px;
`;

export const TradingCompText = styled.p`
    font-size: 18px;
    color: ${(props) => props.theme.textColor.primary};
    line-height: 25px;
    strong {
        font-weight: bold;
        cursor: pointer;
        color: #00f9ff;
    }
    a {
        display: contents;
        font-weight: bold;
        cursor: pointer;
        color: #00f9ff;
    }
`;

export const FormContainer = styled.div`
    color: var(--color-highlight);
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: auto;
    align-self: center;
    @media (max-width: 1250px) {
        display: none;
    }
`;

export const IconHolder = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const UserAvatar = styled(Image)<{ winner?: boolean }>`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    margin: 5px 0px;
    border: ${(props) => (props.winner ? '2px solid #FFE489' : 'none')};
    filter: ${(props) => (props.winner ? 'drop-shadow(0px 0px 15px rgba(255, 232, 155, 0.7))' : 'none')};
    @media (max-width: 1024px) {
        width: 40px;
        height: 40px;
    }
`;

export const Gain = styled.p<{ color?: string }>`
    color: ${(_props) => (_props?.color ? _props.color : '')};
`;

export const CustomTableHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

type MenuContainerChild = {
    Item: StyledComponent<
        'div',
        any,
        {
            active?: boolean;
            customActiveColor?: string;
            customActiveLabelColor?: string;
            noStrech?: boolean;
            padding?: string;
        }
    >;
};

type ContainerChild = {
    Main: StyledComponent<'div', any, { justifyContent?: string; hide?: boolean }> & MenuContainerChild;
    Tab: StyledComponent<'div', any>;
};

// @ts-ignore
const MenuContainer: StyledComponent<'div', any, { justifyContent?: string; hide?: boolean }> &
    MenuContainerChild = styled(FlexDiv)<{
    justifyContent?: string;
    hide?: boolean;
}>`
    ${(_props) => (_props?.hide ? 'display: none;' : '')}
    width: 100%;
    flex-direction: row;
    justify-content: ${(_props) => (_props?.justifyContent ? _props.justifyContent : 'stretch')};
    align-items: stretch;
    border-bottom: 4px solid var(--table-border-color);
    border-radius: 3px;
    @media (max-width: 1024px) {
        margin-top: 30px;
    }
    @media (max-width: 768px) {
        display: none;
    }
`;

// @ts-ignore
const Container: StyledComponent<'div', any> & ContainerChild = styled(FlexDiv)`
    width: 100%;
    flex-direction: column;
`;

const Tab = styled.div`
    width: 100%;
    display: flex;
    @media (max-width: 1024px) {
        flex-direction: column;
        gap: 30px;
    }
`;

const MenuItem = styled.div<{
    active?: boolean;
    customActiveColor?: string;
    customActiveLabelColor?: string;
    noStrech?: boolean;
    padding?: string;
}>`
    text-align: center;
    ${(_props) => (!_props?.noStrech ? 'flex: 1' : '')};
    color: ${(_props) =>
        _props?.customActiveLabelColor ? _props?.customActiveLabelColor : _props.theme.textColor.primary};
    box-shadow: ${(_props) =>
        _props?.active
            ? _props?.customActiveColor
                ? `${_props?.customActiveColor}`
                : '0px 4px var(--primary-filter-menu-active)'
            : ''};
    text-transform: uppercase;
    padding: ${(_props) => (_props?.padding ? _props.padding : '12px 5px')};
    cursor: pointer;
`;

MenuContainer.Item = MenuItem;

Container.Main = MenuContainer;
Container.Tab = Tab;

export default Container;
