import ElectionsBanner from 'components/ElectionsBanner';
import SearchInput from 'components/SearchInput/SearchInput';
import BannerCarousel from 'pages/Trade/components/BannerCarousel';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MyPortfolio from './components/MyPortfolio';
import TradingProfile from './components/TradingProfile/TradingProfile';
import { Container, Header, MainContainer, Tab, TabContainer } from './styled-components';

const TABS = [
    {
        id: 1,
        labelKey: 'profile.main-tabs.trading-profile',
    },
    {
        id: 2,
        labelKey: 'profile.main-tabs.my-portfolio',
    },
];

const Profile: React.FC = () => {
    const { t } = useTranslation();

    const [searchText, setSearchText] = useState<string>('');
    const [tabIndex, setTabIndex] = useState<number>(1);

    return (
        <>
            <ElectionsBanner />
            <BannerCarousel />
            <Container>
                <Header>
                    <TabContainer>
                        {TABS.map((item, index) => {
                            return (
                                <Tab
                                    key={`tab-${index}`}
                                    onClick={() => setTabIndex(item.id)}
                                    active={item.id == tabIndex}
                                >
                                    {t(item.labelKey)}
                                </Tab>
                            );
                        })}
                    </TabContainer>
                    <SearchInput
                        placeholder={t('profile.search-placeholder')}
                        text={searchText}
                        handleChange={(value) => setSearchText(value)}
                        width="300px"
                        height="28px"
                        iconTop="6px"
                    />
                </Header>
                <MainContainer>
                    {tabIndex == TABS[0].id && <TradingProfile searchText={searchText} />}
                    {tabIndex == TABS[1].id && <MyPortfolio />}
                </MainContainer>
            </Container>
        </>
    );
};

export default Profile;
