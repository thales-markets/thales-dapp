import React, { useState } from 'react';
import styled from 'styled-components';
import { CardsAbs, FlexDiv, FlexDivColumn, Image, Text } from 'theme/common';
import plus from 'assets/images/plus.svg';
import minus from 'assets/images/minus.svg';
import faq from 'assets/images/faq.svg';
import { useTranslation } from 'react-i18next';

const Faq: React.FC = () => {
    const { t } = useTranslation();

    const [q1open, setQ1open] = useState(false);
    const [q2open, setQ2open] = useState(false);
    const [q3open, setQ3open] = useState(false);

    return (
        <>
            <CardFaq>
                <Text className="text-xxl pale-grey">{t('landing-page.faq.title')}</Text>
                <DropDownWrapper className={q1open ? 'open' : ''}>
                    <Question>
                        <Text className="text-m pale-grey">{t('landing-page.faq.firstQ')}</Text>
                        <Image src={q1open ? minus : plus} onClick={() => setQ1open(!q1open)}></Image>
                    </Question>
                    <Answer className="text-s pale-grey lh24 ls25">{t('landing-page.faq.firstA')}</Answer>
                </DropDownWrapper>
                <DropDownWrapper className={q2open ? 'open' : ''}>
                    <Question>
                        <Text className="text-m pale-grey">{t('landing-page.faq.secondQ')}</Text>
                        <Image src={q2open ? minus : plus} onClick={() => setQ2open(!q2open)}></Image>
                    </Question>
                    <Answer className="text-s pale-grey lh24 ls25">{t('landing-page.faq.secondA')}</Answer>
                </DropDownWrapper>
                <DropDownWrapper className={q3open ? 'open' : ''}>
                    <Question>
                        <Text className="text-m pale-grey lh24 ls25">{t('landing-page.faq.thirdQ')}</Text>
                        <Image src={q3open ? minus : plus} onClick={() => setQ3open(!q3open)}></Image>
                    </Question>
                    <Answer className="text-s pale-grey lh24 ls25">{t('landing-page.faq.thirdA')}</Answer>
                </DropDownWrapper>
            </CardFaq>
            <FaqImg src={faq} />
        </>
    );
};

const CardFaq = styled(CardsAbs)`
    margin: 65px 0 200px 70px;
    padding: 45px 30px 45px 75px;
    min-width: min(850px, 100%);
`;

const DropDownWrapper = styled(FlexDivColumn)`
    margin-top: 12px;
    padding: 20px 0;
    &:not(:last-child) {
        border-bottom: 1.5px dashed #00f9ff;
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
    height: 600px;
    margin-right: -80px;
    margin-bottom: 100px;
`;

export default Faq;
