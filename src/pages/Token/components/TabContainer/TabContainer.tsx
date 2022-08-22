import queryString from 'query-string';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { StyledComponent } from 'styled-components';
import { FlexDiv } from 'theme/common';
import { getIsOVM } from 'utils/network';
import { history } from 'utils/routes';
import Button from '../Button';
import { ButtonType } from '../Button/Button';
import Tab from '../Tab';

type TabItem = { id: string; name: string; disabled: boolean };

const TabContainer: React.FC<{
    tabItems: TabItem[];
    selectedTab: string;
    setSelectedTab: (tabId: string) => void;
}> = ({ tabItems, selectedTab, setSelectedTab }) => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

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
                {isL2 && (
                    <Button
                        type={ButtonType.default}
                        active={true}
                        width={'250px'}
                        margin={'0 0 0 auto'}
                        activeTextColor={'#ffffff'}
                        hoverShadow={false}
                        activeBg={'linear-gradient(270deg, #516aff 0%, #8208fc 100%)'}
                        fontSize={'20px'}
                    >
                        {t('options.earn.merge-account.title')}
                    </Button>
                )}
            </MenuContainer>
            <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
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
    ${(_props) => (!_props?.noStrech ? 'flex: 1' : 'width: 25%')};
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

export default TabContainer;
