import queryString from 'query-string';
import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import { TokenTabSection, TokenTabSectionIdEnum } from 'types/token';
import { history } from 'utils/routes';
import Tab from '../Tab';

type TabItem = { id: string; name: string };

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
                                    const paramActiveButtonId = queryString.parse(location.search).activeButtonId;
                                    history.push({
                                        pathname: location.pathname,
                                        search: queryString.stringify({
                                            tab: tab.id,
                                            activeButtonId: paramActiveButtonId,
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

const MenuContainer = styled(FlexDiv)`
    width: 100%;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
    border-bottom: 4px solid ${(props) => props.theme.borderColor.tertiary};
    border-radius: 3px;
    @media (max-width: 1024px) {
        margin-top: 30px;
    }
    @media (max-width: 768px) {
        display: none;
    }
`;

const Container = styled(FlexDiv)`
    width: 100%;
    flex-direction: column;
`;

const MenuItem = styled.div<{
    active?: boolean;
    noStrech?: boolean;
}>`
    font-weight: 400;
    font-size: 25px;
    text-align: center;
    ${(props) => (!props?.noStrech ? 'flex: 1' : 'width: 25%')};
    color: ${(props) => (props.active ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
    box-shadow: ${(props) => (props.active ? `0px 4px ${props.theme.borderColor.quaternary}` : '')};
    text-transform: uppercase;
    padding: 10px 5px;
    cursor: pointer;
    @media (max-width: 1192px) {
        font-size: 23px;
        padding: 5px;
    }
`;

export default TabContainer;
