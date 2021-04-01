import React from 'react';
import styled from 'styled-components';
import img1 from 'assets/images/img1.svg';
import img2 from 'assets/images/img2.svg';
import img3 from 'assets/images/img3.svg';
import Header from 'components/Header';

export const Home: React.FC = () => {
    const Section = styled.section`
        &:nth-child(odd) {
            background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
        }
        &:nth-child(even) {
            background: white;
        }
    `;

    const Wrapper = styled.div`
        display: flex;
        width: min(100%, 1440px);
        margin: auto;
        @media (max-width: 768px) {
            flex-direction: column;
        }
    `;

    const Side = styled.div`
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 120px 140px 120px 60px;
        &:first-child {
            padding: 120px 60px 120px 140px;
        }
        @media (max-width: 768px) {
            padding: 40px !important;
        }
    `;
    const SideHeader = styled.h2`
        font-family: Titillium Web;
        font-style: normal;
        font-weight: bold;
        font-size: 49px;
        line-height: 64px;
        letter-spacing: -1px;
        color: ${(props) => props.color};
    `;
    const SideContent = styled.h2`
        font-family: Titillium Web;
        font-style: normal;
        font-weight: normal;
        font-size: 20px;
        line-height: 32px;
        letter-spacing: 0.2px;
        color: ${(props) => props.color};
    `;
    const Image = styled.img`
        width: 100%;
        height: 100%;
    `;

    const ListHeader = styled.h2`
        font-family: Titillium Web;
        font-style: normal;
        font-weight: 600;
        font-size: 25px;
        line-height: 48px;
        color: #fff;
    `;

    const List = styled.ul`
        list-style-position: outside;
        padding-left: 20px;
    `;

    const ListItem = styled.li`
        font-family: Titillium Web;
        font-style: normal;
        font-weight: normal;
        font-size: 20px;
        line-height: 32px;
        letter-spacing: 0.2px;
        color: #fff;
    `;

    return (
        <>
            <Section>
                <Wrapper>
                    <Header />
                </Wrapper>
                <Wrapper>
                    <Side>
                        <SideHeader color="white">Non-custodial Options Trading</SideHeader>
                    </Side>
                    <Side>
                        <Image src={img1}></Image>
                    </Side>
                </Wrapper>
            </Section>
            <Section>
                <Wrapper>
                    <Side>
                        <Image src={img2}></Image>
                    </Side>
                    <Side>
                        <SideHeader color="#04045a">Markets</SideHeader>
                        <SideContent color="#04045a">
                            Thales enables anyone to spin up a market to speculate on the prices of crypto assets,
                            commodities, equities and index products - and earn fees for doing so.
                        </SideContent>
                    </Side>
                </Wrapper>
            </Section>
            <Section>
                <Wrapper>
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
                    </Side>
                    <Side>
                        <Image src={img3}></Image>
                    </Side>
                </Wrapper>
            </Section>
            <Section>
                <Wrapper>
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
                </Wrapper>
            </Section>
            <Section></Section>
        </>
    );
};

export default Home;
