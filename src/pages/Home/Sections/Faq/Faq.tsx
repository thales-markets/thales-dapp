import React, { useState } from 'react';
import styled from 'styled-components';
import { CardsAbs, FlexDiv, FlexDivColumn, Button, Image, Text } from 'theme/common';
import plus from 'assets/images/plus.svg';
import minus from 'assets/images/minus.svg';
import faq from 'assets/images/faq.svg';
import discord from 'assets/images/discord.svg';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANGUAGE, SupportedLanguages } from '../../../../i18n/config';
import i18n from '../../../../i18n';

const getDiscordLink = (selectedLanguage: string) => {
    switch (selectedLanguage) {
        case 'ru':
            return 'https://discord.com/invite/rB3AWKwACM';
        case 'cn':
            return 'https://discord.com/invite/rB3AWKwACM';
        default:
            return 'https://discord.com/invite/rB3AWKwACM';
    }
};

const Faq: React.FC = () => {
    const { t } = useTranslation();
    const selectedLanguage = (Object.values(SupportedLanguages) as string[]).includes(i18n.language)
        ? i18n.language
        : DEFAULT_LANGUAGE;

    const [q1open, setQ1open] = useState(false);
    const [q2open, setQ2open] = useState(false);
    const [q3open, setQ3open] = useState(false);

    return (
        <FlexDivColumn>
            <Wrapper>
                <CardFaq>
                    <Text className="text-l pale-grey">{t('landing-page.faq.title')}</Text>
                    <DropDownWrapper className={q1open ? 'open' : ''}>
                        <Question onClick={() => setQ1open(!q1open)}>
                            <Text className="text-m pale-grey bold lh32 ls25">{t('landing-page.faq.firstQ')}</Text>
                            <Image src={q1open ? minus : plus} />
                        </Question>
                        <Answer className="text-s pale-grey lh24 ls25">{t('landing-page.faq.firstA')}</Answer>
                    </DropDownWrapper>
                    <DropDownWrapper className={q2open ? 'open' : ''}>
                        <Question onClick={() => setQ2open(!q2open)}>
                            <Text className="text-m pale-grey bold lh32 ls25">{t('landing-page.faq.secondQ')}</Text>
                            <Image src={q2open ? minus : plus} />
                        </Question>
                        <Answer className="text-s pale-grey lh24 ls25">{t('landing-page.faq.secondA')}</Answer>
                    </DropDownWrapper>
                    <DropDownWrapper className={q3open ? 'open' : ''}>
                        <Question onClick={() => setQ3open(!q3open)}>
                            <Text className="text-m pale-grey bold lh32 ls25">{t('landing-page.faq.thirdQ')}</Text>
                            <Image src={q3open ? minus : plus} />
                        </Question>
                        <Answer className="text-s pale-grey lh24 ls25">{t('landing-page.faq.thirdA')}</Answer>
                    </DropDownWrapper>
                </CardFaq>
                <FaqImg src={faq} />
            </Wrapper>

            <Button
                className="primary"
                style={{
                    alignSelf: 'center',
                    marginBottom: 100,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 26px',
                }}
                onClick={() => {
                    window.open(getDiscordLink(selectedLanguage), '_blank');
                }}
            >
                <Image src={discord} style={{ height: 37, width: 32, marginRight: 8 }} />
                <Text className="text-l pale-grey bold">{t('landing-page.discord')}</Text>
            </Button>
        </FlexDivColumn>
    );
};

const Wrapper = styled(FlexDiv)`
    padding: 70px 140px;
    justify-content: center;
    position: relative;
    width: 100%;
    @media (max-width: 1280px) {
        padding: 50px;
        flex-direction: column-reverse;
        margin-bottom: 50px;
    }
    @media (max-width: 568px) {
        padding: 20px;
    }
`;

const CardFaq = styled(CardsAbs)`
    margin: auto;
    padding: 45px 30px 45px 75px;
    min-width: min(750px, 100%);
    @media (max-width: 1280px) {
        position: relative;
        width: 100%;
        min-width: 500px;
    }
    @media (max-width: 568px) {
        padding: 20px;
        min-width: unset;
    }
`;

const DropDownWrapper = styled(FlexDivColumn)`
    margin-top: 12px;
    padding: 20px 0;
    flex: 0;
    &:not(:last-child) {
        border-bottom: 1px solid #00f9ff;
    }
    &.open {
        & > p {
            position: relative;
            opacity: 1;
            transition: opacity 1s;
        }
    }
`;

const Question = styled(FlexDiv)`
    justify-content: space-between;
    align-items: center;
    img {
        cursor: pointer;
        width: 20px;
        height: 20px;
        align-self: flex-start;
        top: 2px;
        position: relative;
    }
`;
const Answer = styled(Text)`
    opacity: 0;
    position: absolute;
    pointer-events: none;
    margin-top: 10px;
    white-space: break-spaces;
`;

const FaqImg = styled(Image)`
    height: 450px;
    max-width: 450px;
    margin-right: -80px;
    margin-bottom: 100px;
    margin-top: 50px;
    @media (max-width: 1280px) {
        height: 400px;
        margin: 60px auto;
        margin-top: 0;
    }
`;

export default Faq;
