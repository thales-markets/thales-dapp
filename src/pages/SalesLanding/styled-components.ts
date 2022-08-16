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
    grid-template-rows: repeat(190, 2em);
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
    font-size: 1.4em;
    font-style: normal;
    font-weight: 700;
    line-height: 1em;
    letter-spacing: 0em;
    text-align: justified;
    color: var(--color);
    margin-top: 2em;
    margin-bottom: 1em;
`;

export const SectionWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 50px 0px;
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
    }
    a {
        font-family: NunitoSemiBold !important;
        text-decoration: underline;
    }
`;

export const ParagraphContainer = styled.div<{ width?: string }>`
    width: ${(_props) => (_props?.width ? _props.width : '50%')};
    margin-right: 30px;
`;

export const IllustrationContainer = styled.div<{ width?: string }>`
    width: ${(_props) => (_props?.width ? _props.width : '50%')};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Content = styled.div`
    grid-column-start: 1;
    grid-column-end: 51;
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

export const ListWrapper = styled.div`
    border: 1px solid var(--color);
    border-radius: 7px;
    width: 38em;
    margin-bottom: 4em;
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
            padding-right: 0.5em;
            vertical-align: text-top;
        }
        & > a {
            font-family: Nunito !important;
            font-style: normal;
            font-size: 1.4em;
            font-weight: 300;
            line-height: 170%;
            color: var(--color);
            &:hover {
                font-size: 1.6em;
                transition: 0.2s;
            }
        }
        @media (max-width: 450px) {
            &:nth-child(3),
            &:nth-child(4),
            &:nth-child(5) {
                padding-bottom: 5em;
            }
        }
    }
`;

export const ListItem = styled.li`
    height: 3em;
    color: var(--color);
`;
