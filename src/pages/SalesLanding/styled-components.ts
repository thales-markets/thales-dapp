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
    grid-template-rows: repeat(77, 2em);
    z-index: 1;
    @media (max-width: 600px) {
        grid-template-rows: repeat(104, 2em);
    }
`;
