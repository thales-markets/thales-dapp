import styled from 'styled-components';

export const Info = styled.div`
    width: 100%;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    text-align: center;
    padding: 10px;
    font-size: 16px;
    background-color: ${(props) => props.theme.landingPage.background.secondary};
    box-shadow: 0px 0px 20px rgb(0 0 0 / 40%);
    z-index: 2;
    position: absolute;
    strong {
        font-weight: bold;
        cursor: pointer;
        margin-left: 0.2em;
        color: ${(props) => props.theme.landingPage.textColor.secondary};
    }
    a {
        display: contents;
        font-weight: bold;
        cursor: pointer;
        color: ${(props) => props.theme.landingPage.textColor.secondary};
    }
`;

export const Title = styled.h2`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 4.4em;
    @media (max-width: 600px) {
        font-size: 2em;
    }
    line-height: 91.91%;
    text-align: center;
    color: ${(props) => props.theme.landingPage.textColor.primary};
`;

export const FlexWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 1122px;
    align-items: center;
    padding: 0 20px;
`;

export const Faq = styled.div`
    background: ${(props) => props.theme.landingPage.background.secondary};
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.4);
    border-radius: 7px;
    margin: 3em 4em;
    padding: 2em;
    @media (max-width: 600px) {
        margin-left: 0;
        margin-right: 0;
        padding: 36px 30px 24px;
    }
`;

export const FaqQuestion = styled.p`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 1.5em;
    line-height: 91.91%;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    margin-bottom: 1em;
    @media (max-width: 600px) {
        margin-bottom: 24px;
    }
`;

export const FaqAnswer = styled.p`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 1em;
    line-height: 1.2em;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    &:not(:last-child) {
        border-bottom: 1px solid ${(props) => props.theme.landingPage.textColor.primary};
        padding-bottom: 2em;
        margin-bottom: 2em;
        @media (max-width: 600px) {
            margin-bottom: 30px;
            padding-bottom: 24px;
        }
    }
`;

export const FlexDiv = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    flex-wrap: wrap;
    &.initiatives {
        & > a > i {
            @media (max-width: 600px) {
                flex: 1 40%;
                text-align: center;
            }
        }
    }
`;
