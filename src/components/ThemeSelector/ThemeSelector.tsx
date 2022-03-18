import React from 'react';
import styled from 'styled-components';

import SwitchInput from 'components/SwitchInput/SwitchInput';
import { FlexDivRow, UserCardSectionHeader } from 'theme/common';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme, setTheme } from 'redux/modules/ui';
import { RootState } from 'redux/rootReducer';

// import { useSelector } from 'react-redux';
// import { RootState } from 'redux/rootReducer';

export const ThemeSelector: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const theme = useSelector((state: RootState) => getTheme(state));

    return (
        <ThemeSelectorContainer>
            <SectionHeader>{t('common.user-info-card.theme')}</SectionHeader>
            <SwitchContainer>
                <ThemeIcon active={theme == 0} className="sidebar-icon icon--light-mode" />
                <SwitchInput
                    value={theme == 0 ? false : true}
                    clickEventHandler={() => dispatch(setTheme(theme == 0 ? 1 : 0))}
                />
                <ThemeIcon
                    active={theme == 1}
                    style={{ marginRight: '0px' }}
                    className="sidebar-icon icon--dark-mode"
                />
            </SwitchContainer>
        </ThemeSelectorContainer>
    );
};

const ThemeSelectorContainer = styled(FlexDivRow)`
    width: 100%;
    align-items: center;
    margin: 16px 0px;
    justify-content: flex-start;
`;

const SectionHeader = styled(UserCardSectionHeader)`
    display: inline-block;
    margin-right: 65px;
    width: 80px;
`;

const ThemeIcon = styled.i<{ active: boolean }>`
    font-size: 17px;
    display: inline;
    color: ${(props: any) => (props.active ? 'var(--icon-color)' : '#8181ac')};
    margin-right: 5px;
    margin-left: 5px;
`;

const SwitchContainer = styled.div`
    display: flex;
    align-items: center;
`;

export default ThemeSelector;
