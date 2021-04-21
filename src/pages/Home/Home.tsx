import React from 'react';
import Header from 'components/Header';
import { SideContent, List } from './components';
import { Button, FlexDiv, FlexDivColumn, Section, Side, Text, Li } from 'theme/common';
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
                            <Text className="title">{t('landing-page.title')}</Text>
                            <Text className="text-m bold pale-grey" style={{ margin: '40px 0' }}>
                                {t('landing-page.description')}
                            </Text>
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
                    <Text className="text-xxl dark">{t('landing-page.markets.title')}</Text>
                    <SideContent className="text-m dark">{t('landing-page.markets.description')}</SideContent>
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
                    <Text className="text-xxl white">{t('landing-page.options.title')}</Text>
                    <Text className="text-lm bold white">{t('landing-page.options.description')}</Text>
                    <List>
                        <Li className="text-m white">{t('landing-page.options.option1')}</Li>
                        <Li className="text-m white">{t('landing-page.options.option2')}</Li>
                        <Li className="text-m white">{t('landing-page.options.option3')}</Li>
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
                    <Text className="text-xxl dark">{t('landing-page.who-is-thales')}</Text>
                    <SideContent className="text-m dark">{t('landing-page.thales-is')}</SideContent>
                </Side>
            </Section>
            <Footer></Footer>
        </>
    );
};

export default Home;
