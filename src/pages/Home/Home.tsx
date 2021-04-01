import React from 'react';
import styled from 'styled-components';
import img1 from 'assets/images/img1.svg';
import img2 from 'assets/images/img2.svg';
import img3 from 'assets/images/img3.svg';

export const Home: React.FC = () => {
    const Section = styled.section`
        &:nth-child(odd) {
            background: white;
            #{}
        }
        &:nth-child(even) {
            background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
        }
    `;

    const Wrapper = styled.div`
        display: flex;
    `;

    const Side = styled.div`
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 120px;
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

    return (
        <>
            <Section>
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
                        <SideContent color="white">
                            Thales enables anyone to spin up a market to speculate on the prices of crypto assets,
                            commodities, equities and index products - and earn fees for doing so.
                        </SideContent>
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
                            Thales enables anyone to spin up a market to speculate on the prices of crypto assets,
                            commodities, equities and index products - and earn fees for doing so.
                        </SideContent>
                    </Side>
                </Wrapper>
            </Section>
            <Section></Section>
        </>
    );
};

export default Home;
