import { ReactComponent as ChartBlack } from 'assets/images/landing-page/articles/governance-black.svg';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { HashLink } from 'react-router-hash-link';
import styled from 'styled-components';
import { FlexDivCentered } from 'theme/common';
import Footer from '../../components/Footer';
import Header from '../../components/Header/Header';
import { Background } from '../../Home';

const Governance: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Background>
            <Wrapper>
                <Header />
                <Content>
                    <H1>{t('articles.governance.title')}</H1>
                    <ListWrapper>
                        <List>
                            <ListItem>{t('articles.governance.list.0')}</ListItem>
                            <NestedList>
                                <ListItem>
                                    <HashLink to="#section1">{t('articles.governance.list.1')}</HashLink>
                                </ListItem>
                                <ListItem>
                                    <HashLink to="#section2">{t('articles.governance.list.2')}</HashLink>
                                </ListItem>
                                <ListItem>
                                    <HashLink to="#section2">{t('articles.governance.list.3')}</HashLink>
                                </ListItem>
                                <ListItem>
                                    <HashLink to="#section4">{t('articles.governance.list.4')}</HashLink>
                                </ListItem>
                                <ListItem>
                                    <HashLink to="#section5">{t('articles.governance.list.5')}</HashLink>
                                </ListItem>
                            </NestedList>
                        </List>
                    </ListWrapper>

                    <Paragraph>
                        <Trans
                            i18nKey="articles.governance.paragraphs.intro1"
                            components={{
                                bold: <strong />,
                                urlStaking: (
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://thalesmarket.io/token?activeButtonId=staking"
                                    />
                                ),
                                urlVoting: (
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://thalesmarket.io/governance/thalescouncil.eth/"
                                    />
                                ),
                            }}
                        />
                    </Paragraph>
                    <ChartWrapper>
                        <ChartBlack />
                    </ChartWrapper>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.governance.paragraphs.intro2"
                            components={{
                                bold: <strong />,
                                url: (
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://medium.com/@Thales.Academy/how-to-use-github-to-submit-a-tip-e7d0047b54fd"
                                    />
                                ),
                            }}
                        />
                    </Paragraph>
                    <H2 id="section1">{t('articles.governance.list.1')}</H2>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.governance.paragraphs.1"
                            components={{
                                bold: <strong />,
                            }}
                        />
                    </Paragraph>

                    <H2 id="section2">{t('articles.governance.list.2')}</H2>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.governance.paragraphs.2"
                            components={{
                                bold: <strong />,
                                url: (
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://github.com/thales-markets/thales-improvement-proposals/tree/main/TIPs"
                                    />
                                ),
                                urlDisc: <a target="_blank" rel="noreferrer" href="https://discord.gg/thales" />,
                                urlGov: (
                                    <a target="_blank" rel="noreferrer" href="https://thalesmarket.io/governance" />
                                ),
                                urlDraft: (
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href=" https://github.com/thales-markets/thales-improvement-proposals/blob/main/TIPs/TIP-1.md"
                                    />
                                ),
                                urlStaking: (
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://thalesmarket.io/token?activeButtonId=staking"
                                    />
                                ),
                            }}
                        />
                    </Paragraph>

                    <H2 id="section3">{t('articles.governance.list.3')}</H2>
                    <Paragraph>
                        <Trans i18nKey="articles.governance.paragraphs.3" />
                    </Paragraph>

                    <H2 id="section4">{t('articles.governance.list.4')}</H2>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.governance.paragraphs.4"
                            components={{
                                bold: <strong />,
                                url: <a target="_blank" rel="noreferrer" href="https://contracts.thalesmarket.io/" />,
                            }}
                        />
                    </Paragraph>

                    <H2 id="section5">{t('articles.governance.list.5')}</H2>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.governance.paragraphs.5"
                            components={{
                                bold: <strong />,
                                url: <a target="_blank" rel="noreferrer" href="https://discord.com/invite/thales" />,
                            }}
                        />
                    </Paragraph>
                    <Footer className="article" />
                </Content>
            </Wrapper>
        </Background>
    );
};

const Wrapper = styled.div`
    display: grid;
    width: 100%;
    margin: auto;
    max-width: 1122px;
    grid-template-columns: repeat(51, 1fr);
    grid-template-rows: repeat(110, 2em);
`;

const Content = styled.div`
    grid-column-start: 7;
    grid-column-end: 48;
    grid-row-start: 8;
    grid-row-end: 80;
    width: 100%;
    @media (max-width: 1024px) {
        position: absolute;
        display: block;
        top: 140px;
        width: 100vw;
        padding: 0 40px;
        z-index: 9;
        grid-column-start: unset;
        grid-column-end: unset;
        grid-row-start: unset;
        grid-row-end: unset;
    }
`;

const H1 = styled.h1`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 3.8em;
    line-height: 91.91%;
    text-align: justify;
    text-transform: uppercase;
    color: var(--color-white);
    margin-top: 1em;
    margin-bottom: 1.3em;
`;

const H2 = styled.h2`
    font-family: NunitoSemiBold !important;
    font-size: 1.4em;
    font-style: normal;
    font-weight: 700;
    line-height: 1em;
    letter-spacing: 0em;
    text-align: justified;
    color: var(--color-white);
    margin-top: 2em;
    margin-bottom: 1em;
`;
const Paragraph = styled.p`
    font-size: 1.4em;
    line-height: 1em;
    &,
    & * {
        color: var(--color-white);
        font-family: NunitoExtraLight !important;
        font-style: normal;
        font-weight: 300;
        letter-spacing: 0em;
        text-align: justified;
        white-space: pre-line;
    }
    strong {
        font-family: NunitoSemiBold !important;
    }
    a {
        font-family: NunitoSemiBold !important;
        text-decoration: underline;
    }
`;

const ListWrapper = styled.div`
    border: 1px solid var(--color-white);
    border-radius: 7px;
    width: 38em;
    margin-bottom: 4em;
    @media (max-width: 600px) {
        width: 100%;
    }
}
`;

const List = styled.ul`
    list-style: disc;
    color: var(--color-white);
    margin-left: 2em;
    padding: 1.5em;
    & > li {
        font-family: Nunito !important;
        font-style: normal;
        font-size: 1.4em;
        font-weight: 700;
        line-height: 170%;
        height: 2em;
    }
    @media (max-width: 600px) {
        margin-left: 1em;
    }
`;

const NestedList = styled.ul`
    list-style: none;
    color: var(--color-white);
    & li {
        &:before {
            content: '\\25BA \\0020';
            padding-right: 0.5em;
            vertical-align: text-top;
        }
        & > a {
            font-family: Nunito !important;
            font-style: normal;
            font-size: 1.4em;
            font-weight: 300;
            line-height: 170%;
            color: var(--color-white);
            &:hover {
                font-size: 1.6em;
                transition: 0.2s;
            }
        }
        @media (max-width: 450px) {
            &:nth-child(2),
            &:nth-child(3),
            &:nth-child(4),
            &:nth-child(5) {
                padding-bottom: 5em;
            }
        }
    }
`;

const ListItem = styled.li`
    height: 3em;
    color: var(--color-white);
`;

const ChartWrapper = styled(FlexDivCentered)`
    margin: 3em 0;
`;

export default Governance;
