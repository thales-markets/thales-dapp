import styled from 'styled-components';

export const Background = styled.div`
    width: 100%;
    font-size: 16px;

    @media (max-width: 1440px) {
        font-size: 14px;
    }

    &.light {
        background: #f7f7f7;
        --main-background: #f7f7f7;
        --color: #052040;
        --background: #ffffff;
    }
    &.dark {
        background: #052040;
        --main-background: #052040;
        --color: #f7f7f7;
        --background: #1b314f;
    }
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
    font-style: normal;
    font-weight: bold;
    font-size: 3.8em;
    line-height: 91.91%;
    text-transform: uppercase;
    color: var(--color);
    margin-top: 1em;
    margin-bottom: 1.3em;
`;

export const H2 = styled.h2`
    font-family: NunitoSemiBold !important;
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
    line-height: 1em;
    letter-spacing: 0em;
    text-align: justified;
    color: var(--color);
    margin-top: 2em;
    margin-bottom: 1em;
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
    font-size: 1.4em;
    line-height: 1em;
    &,
    & * {
        color: var(--color);
        font-family: NunitoExtraLight !important;
        font-style: normal;
        font-weight: 300;
        letter-spacing: 0em;
        text-align: justified;
        white-space: pre-line;
    }
    strong {
        font-family: NunitoSemiBold !important;
        font-weight: bold;
        font-size: 1.1em;
    }
    a {
        font-family: NunitoSemiBold !important;
        text-decoration: none;
        color: #64d9fe;
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
    @media screen and (max-width: 700px) {
        width: 100% !important;
        margin: 30px auto !important;
    }
`;

export const Content = styled.div`
    max-width: 1122px;
    margin: 0 auto;
    @media (max-width: 1024px) {
        width: 100vw;
        padding: 0 40px;
    }
`;

export const ListWrapper = styled.div`
    border: 1px solid var(--color);
    border-radius: 7px;
    width: 60%;
    @media (max-width: 600px) {
        width: 100%;
    }
`;

export const List = styled.ul`
    list-style: disc;
    color: var(--color);
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

export const NestedList = styled.ul`
    list-style: none;
    color: var(--color);
    & li {
        &:before {
            content: '\\25BA \\0020';
            padding-right: 5px;
            vertical-align: text-top;
        }
        & > a {
            font-family: Nunito !important;
            font-style: normal;
            font-size: 20px;
            font-weight: 300;
            line-height: 170%;
            color: var(--color);
            &:hover {
                font-size: 21px;
                transition: 0.2s;
            }
        }
    }
`;

export const OrderedListContrainer = styled.div`
    margin: 40px auto;
    color: var(--color);
    margin-left: 30px;
    @media screen and (max-width: 700px) {
        margin-left: 10px;
    }
`;

export const OrderedList = styled.ol`
    list-style: none;
`;

export const OrderedItem = styled.li`
    counter-increment: item;
    font-weight: 300;
    margin-bottom: 15px;
    font-size: 19px;
    &::before {
        content: counter(item) '.';
        font-size: 25px;
        margin-right: 5px;
        font-weight: bold;
    }
    strong {
        font-weight: bold;
    }
`;

export const ListItem = styled.li`
    color: var(--color);
`;
