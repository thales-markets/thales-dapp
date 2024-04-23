import styled from 'styled-components';
import { FlexDiv } from 'styles/common';

export const Background = styled.div`
    width: 100%;
    font-size: 16px;

    @media (max-width: 1440px) {
        font-size: 14px;
    }

    background: #052040;
    --main-background: #052040;
    --color: #f7f7f7;
    --background: #1b314f;
`;

export const Wrapper = styled.div`
    display: grid;
    width: 100%;
    margin: auto;
    max-width: 1122px;
    grid-template-columns: repeat(51, 1fr);
    grid-template-rows: repeat(3, 2em);
`;

export const AnimationSvg = styled.object`
    @media screen and (max-width: 500px) {
        width: 100%;
    }
`;

export const H1 = styled.h1`
    font-family: Playfair Display !important;
    font-weight: 700;
    font-size: 42px;
    line-height: 110%;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
    margin-top: 50px;
    margin-bottom: 30px;
`;

export const H2 = styled.h2`
    font-family: Nunito !important;
    font-size: 24px;
    font-weight: 800;
    line-height: 30px;
    text-align: left;
    color: ${(props) => props.theme.textColor.primary};
    margin: 41px 0px;
    &:after {
        font-family: Icons !important;
        content: '\\007A';
        color: ${(props) => props.theme.landingPage.textColor.tertiary};
        padding-left: 20px;
        font-weight: 900;
        vertical-align: text-top;
    }
`;

export const SectionWrapper = styled.div<{ flexDirection?: string }>`
    display: flex;
    flex-direction: ${(_props) => (_props?.flexDirection ? _props.flexDirection : 'row')};
    width: 100%;
    margin: 50px 0px;
    @media screen and (max-width: 700px) {
        flex-wrap: wrap;
    }
`;

export const Paragraph = styled.p`
    font-size: 24px;
    line-height: 30px;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    font-family: NunitoExtraLight !important;
    white-space: pre-line;
    a {
        color: ${(props) => props.theme.landingPage.textColor.tertiary};
        text-decoration: underline;
    }
    @media screen and (max-width: 500px) {
        text-align: justify;
    }
`;

export const ParagraphContainer = styled.div<{ width?: string }>`
    width: ${(_props) => (_props?.width ? _props.width : '50%')};
    margin-right: 30px;
    @media screen and (max-width: 700px) {
        width: 100% !important;
        margin-right: 0px;
        margin-left: 0px;
    }
`;

export const IllustrationContainer = styled.div<{ width?: string }>`
    width: ${(_props) => (_props?.width ? _props.width : '50%')};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
    @media screen and (max-width: 700px) {
        width: 100% !important;
        margin: 30px auto !important;
    }
`;

export const Content = styled.div`
    max-width: 1122px;
    margin: 0 auto;
    font-family: Nunito !important;
    @media (max-width: 1024px) {
        width: 100vw;
        padding: 0 40px;
    }
`;

export const ListWrapper = styled(FlexDiv)`
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

export const List = styled(FlexDiv)`
    border: 3px solid ${(props) => props.theme.landingPage.textColor.tertiary};
    border-radius: 7px;
    padding: 1.5em;
    position: relative;
`;

export const NestedList = styled.ul`
    list-style: none;
    color: var(--color);
    & li {
        &:before {
            font-family: Icons !important;
            content: '\\007A';
            color: ${(props) => props.theme.landingPage.textColor.tertiary};
            padding-right: 20px;
            font-weight: 900;
            vertical-align: text-top;
        }
        & > a {
            font-family: Nunito !important;
            font-style: normal;
            line-height: 170%;
            color: ${(props) => props.theme.textColor.primary};
            font-weight: 600;
            font-size: 24px;
            margin: 5px 0px;
        }
    }
`;

export const OrderedListContrainer = styled(FlexDiv)`
    flex: 2;
    margin: 40px auto;
    color: var(--color);
    margin-left: 30px;
    @media screen and (max-width: 700px) {
        margin-left: 10px;
    }
`;

export const OrderedList = styled.ol`
    list-style: none;
    counter-reset: item;
    list-style-position: outside;
    list-style-type: none;
`;

export const OrderedItem = styled.li`
    counter-increment: item;
    font-weight: 400;
    margin-bottom: 15px;
    font-style: italic !important;
    font-size: 21px;
    &::before {
        content: counter(item) '.';
        font-size: 32px;
        margin-right: 10px;
        font-weight: bold;
    }
`;

export const ListItem = styled.li``;

export const Button = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45%;
    background-color: #64d9fe;
    color: #04045a;
    border-radius: 20px;
    font-size: 20px;
    font-weight: 700;
    padding: 15px;
    text-align: center;
`;

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 15px 0px;
`;
