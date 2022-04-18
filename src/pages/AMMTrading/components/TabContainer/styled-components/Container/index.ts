import styled, { StyledComponent } from 'styled-components';
import { FlexDiv } from 'theme/common';

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
    font-family: Roboto !important;
    font-style: normal;
    color: ${(_props) => (_props?.customActiveLabelColor ? _props?.customActiveLabelColor : 'var(--primary-color)')};
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
