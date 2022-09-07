import queryString from 'query-string';
import React from 'react';
import { useLocation } from 'react-router-dom';
import styled, { StyledComponent } from 'styled-components';
import { FlexDiv } from 'theme/common';
import { TokenTabSection, TokenTabSectionIdEnum } from 'types/token';
import { history } from 'utils/routes';
import Tab from '../Tab';

type TabItem = { id: string; name: string; disabled: boolean };

const TabContainer: React.FC<{
    tabItems: TabItem[];
    selectedTab: string;
    setSelectedTab: (tabId: string) => void;
    tabSections: TokenTabSection[];
    selectedSection?: TokenTabSectionIdEnum;
}> = ({ tabItems, selectedTab, setSelectedTab, tabSections, selectedSection }) => {
    const location = useLocation();

    return (
        <Container>
            <MenuContainer>
                {tabItems &&
                    tabItems.map((tab, index) => {
                        return (
                            <MenuItem
                                active={tab.id == selectedTab}
                                key={index}
                                noStrech={true}
                                onClick={() => {
                                    if (tab.disabled) return;
                                    history.push({
                                        pathname: location.pathname,
                                        search: queryString.stringify({
                                            tab: tab.id,
                                        }),
                                    });
                                    setSelectedTab(tab.id);
                                }}
                            >
                                {tab.name}
                            </MenuItem>
                        );
                    })}
            </MenuContainer>
            <Tab
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                sections={tabSections}
                selectedSection={selectedSection}
            />
        </Container>
    );
};

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
    ${(props) => (props?.hide ? 'display: none;' : '')}
    width: 100%;
    flex-direction: row;
    justify-content: ${(props) => (props?.justifyContent ? props.justifyContent : 'stretch')};
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

const MenuItem = styled.div<{
    active?: boolean;
    customActiveColor?: string;
    customActiveLabelColor?: string;
    noStrech?: boolean;
    padding?: string;
}>`
    font-weight: 400;
    font-size: 25px;
    text-align: center;
    ${(props) => (!props?.noStrech ? 'flex: 1' : 'width: 25%')};
    font-family: Roboto !important;
    font-style: normal;
    color: ${(props) => (props?.customActiveLabelColor ? props?.customActiveLabelColor : 'var(--primary-color)')};
    box-shadow: ${(props) =>
        props?.active
            ? props?.customActiveColor
                ? `${props?.customActiveColor}`
                : '0px 4px var(--primary-filter-menu-active)'
            : ''};
    text-transform: uppercase;
    padding: ${(props) => (props?.padding ? props.padding : '12px 5px')};
    cursor: pointer;
`;

export default TabContainer;
