import React from 'react';
import img1 from 'assets/images/img1.svg';
import img2 from 'assets/images/img2.svg';
import img3 from 'assets/images/img3.svg';
import github from 'assets/images/github.svg';
import twitter from 'assets/images/twitter.svg';
import discord from 'assets/images/discord.svg';
import synthetix from 'assets/images/synthetix.svg';
import Header from 'components/Header';
import {
    Wrapper,
    InfoText,
    Section,
    Side,
    SideTitle,
    MainWrapper,
    Image,
    SideHeader,
    SideContent,
    ListHeader,
    List,
    ListItem,
    FooterIcon,
    VerticalWrapper,
    PoweredBy,
    SyntetixLogo,
} from './components';
import ROUTES from 'constants/routes';
import { Button } from 'components/base/button';
import styled from 'styled-components';
import { Logo } from 'components/base/logo';

export const MarketButton = styled(Button)`
    background: #3936c7;
    color: #ffffff;
    margin-top: 30px;
`;

export const LaunchApp = styled(Button)`
    padding: 8px 35px;
    background: linear-gradient(90deg, #3936c7 4.67%, #2d83d2 42.58%, #23a5dd 77.66%, #35dadb 95.67%);
    color: white;
    margin-right: 20px;
`;

export const WhoIsThales = styled(Button)`
    background: transparent;
    border: 1.5px solid #44e1e2;
    color: #44e1e2;
`;

export const Home: React.FC = () => {
    return (
        <>
            <Section>
                <MainWrapper>
                    <Header />
                </MainWrapper>
                <MainWrapper>
                    <Side>
                        <SideTitle color="white">Non-custodial Options Trading</SideTitle>
                        <InfoText>Create, trade and excercise binary options</InfoText>
                        <Wrapper>
                            <LaunchApp>Launch app</LaunchApp>
                            <WhoIsThales>Who is Thales?</WhoIsThales>
                        </Wrapper>
                    </Side>
                    <Side>
                        <Image src={img1}></Image>
                    </Side>
                </MainWrapper>
            </Section>
            <Section>
                <MainWrapper>
                    <Side>
                        <Image src={img2}></Image>
                    </Side>
                    <Side>
                        <SideHeader color="#04045a">Markets</SideHeader>
                        <SideContent color="#04045a">
                            Thales enables anyone to spin up a market to speculate on the prices of crypto assets,
                            commodities, equities and index products - and earn fees for doing so.
                        </SideContent>
                        <MarketButton>Create market</MarketButton>
                    </Side>
                </MainWrapper>
            </Section>
            <Section>
                <MainWrapper>
                    <Side>
                        <SideHeader color="white">Trade Options</SideHeader>
                        <ListHeader>Buy and Sell options</ListHeader>
                        <List>
                            <ListItem>
                                Buy or sell a Yes or No option to respond to changes in the price of the underlying
                            </ListItem>
                            <ListItem>
                                Identify high-probability opportunities to earn a profit on mispriced options
                            </ListItem>
                            <ListItem>
                                Earn fees for being a market-maker who offers liquidity on Thales orderbooks, powered by
                                0x
                            </ListItem>
                        </List>
                        <MarketButton>View trading markets</MarketButton>
                    </Side>
                    <Side>
                        <Image src={img3}></Image>
                    </Side>
                </MainWrapper>
            </Section>
            <Section>
                <MainWrapper>
                    <Side>
                        <Image src={img3}></Image>
                    </Side>
                    <Side>
                        <SideHeader color="#04045a">Who is Thales?</SideHeader>
                        <SideContent color="#04045a">
                            Thales is considered the first known person to exercise an options contract in Ancient
                            Greece. In response to challengers who prodded Thales that if Thales was such a famous
                            philosopher then how could he be impoverished, Thales leveraged his knowledge of the seasons
                            and the stars into profitable actions. Thales bought the right to use all the olive presses
                            in town at a very low price in the winter. Several months later, there was a bountiful olive
                            harvest. Thales earned a killing renting out the olive presses to people willing to pay a
                            much higher price than what Thales paid for the rights to use the olive presses.
                        </SideContent>
                    </Side>
                </MainWrapper>
            </Section>
            <Section>
                <VerticalWrapper>
                    <Wrapper>
                        <FooterIcon src={github}></FooterIcon>
                        <FooterIcon src={twitter}></FooterIcon>
                        <FooterIcon src={discord}></FooterIcon>
                    </Wrapper>
                    <Wrapper>
                        <Logo to={ROUTES.Home}>Thales</Logo>
                    </Wrapper>
                    <PoweredBy>
                        Powered by
                        <SyntetixLogo src={synthetix}></SyntetixLogo>
                    </PoweredBy>
                </VerticalWrapper>
            </Section>
        </>
    );
};

export default Home;
