import styled, { StyledComponent } from 'styled-components';
import { FlexDiv } from 'theme/common';

type MenuContainerChild = {
    Item: StyledComponent<'div', any, { active?: boolean }>;
};

type ContainerChild = {
    Main: StyledComponent<'div', any> & MenuContainerChild;
    Tab: StyledComponent<'div', any>;
};

// @ts-ignore
const MenuContainer: StyledComponent<'div', any> & MenuContainerChild = styled(FlexDiv)`
    width: 100%;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
    border-bottom: 4px solid var(--table-border-color);
    border-radius: 3px;
`;

// @ts-ignore
const Container: StyledComponent<'div', any> & ContainerChild = styled(FlexDiv)`
    width: 70%;
    flex-direction: column;
`;

const Tab = styled.div`
    width: 100%;
    display: flex;
`;

const MenuItem = styled.div<{ active?: boolean }>`
    text-align: center;
    flex: 1;
    font-family: Titillium Regular !important;
    font-style: normal;
    color: var(--primary-color);
    box-shadow: ${(_props) => (_props?.active ? '0px 4px var(--primary-filter-menu-active)' : '')};
    text-transform: uppercase;
    padding: 12px 5px;
`;

MenuContainer.Item = MenuItem;

Container.Main = MenuContainer;
Container.Tab = Tab;

export default Container;
