import React from 'react';
import Header from 'components/Header';
import { InfoText, SideTitle, SideContent, ListHeader, Li, List } from './components';
import { Button, FlexDiv, FlexDivColumn, Section, Side, SubTitle } from 'theme/common';
import { useTranslation } from 'react-i18next';
import onboardConnector from 'utils/onboardConnector';
import Footer from './Footer/Footer';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';

const Home: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    return (
        <>
            <Section>
                <FlexDivColumn>
                    <Header />
                    <FlexDiv>
                        <Side>
                            <SideTitle color="white">{t('landing-page.title')}</SideTitle>
                            <InfoText>{t('landing-page.description')}</InfoText>
                            <FlexDiv>
                                <Button
                                    className="secondary"
                                    style={{ padding: '8px 35px', marginRight: '20px' }}
                                    onClick={() => onboardConnector.connectWallet()}
                                >
                                    {t('common.wallet.connect-your-wallet')}
                                </Button>
                                <Button className="tertiary">{t('landing-page.who-is-thales')}</Button>
                            </FlexDiv>
                        </Side>
                        <Side></Side>
                    </FlexDiv>
                </FlexDivColumn>
            </Section>
            <Section>
                <Side></Side>
                <Side>
                    <SubTitle color="#04045a">{t('landing-page.markets.title')}</SubTitle>
                    <SideContent color="#04045a">{t('landing-page.markets.description')}</SideContent>
                    <Button
                        className="primary"
                        style={{ marginTop: '30px' }}
                        onClick={() =>
                            isWalletConnected
                                ? navigateTo(ROUTES.Options.CreateMarket)
                                : onboardConnector.connectWallet()
                        }
                    >
                        {t('landing-page.markets.create-market')}
                    </Button>
                </Side>
            </Section>
            <Section>
                <Side>
                    <SubTitle color="white">{t('landing-page.options.title')}</SubTitle>
                    <ListHeader>{t('landing-page.options.description')}</ListHeader>
                    <List>
                        <Li>{t('landing-page.options.option1')}</Li>
                        <Li>{t('landing-page.options.option2')}</Li>
                        <Li>{t('landing-page.options.option3')}</Li>
                    </List>
                    <Button className="primary" style={{ marginTop: '30px' }}>
                        {t('landing-page.options.view-market')}
                    </Button>
                </Side>
                <Side></Side>
            </Section>
            <Section>
                <Side></Side>
                <Side>
                    <SubTitle color="#04045a">{t('landing-page.who-is-thales')}</SubTitle>
                    <SideContent color="#04045a">{t('landing-page.thales-is')}</SideContent>
                </Side>
            </Section>
            <Footer></Footer>
        </>
    );
};

export default Home;
