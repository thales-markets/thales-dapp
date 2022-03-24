import styled, { keyframes, StyledComponent } from 'styled-components';

type ContainerChild = {
    ColorLabel: StyledComponent<'div', any, { color?: string }>;
    ButtonContainer: StyledComponent<'div', any>;
};

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 20px;
`;

const gradientAnimation = keyframes`
    0% {
        opacity: 1;
    } 
    25% {
        opacity: 0.7;
    }
    50% {
        opacity: 1;
    }
    75% {
        opacity: 0.9;
    }
    100% {
        opacity: 1;
    }
`;

const ColorLabel = styled.div<{ color?: string }>`
    border-radius: 15px 15px 0px 0px;
    margin-top: -32px;
    margin-left: -32px;
    margin-right: -32px;
    margin-bottom: 20px;
    height: 15px;
    z-index: 0;
    animation: ${gradientAnimation} 3s ease infinite;
    ${(_props) => (_props?.color ? `background: ${_props.color}` : '')};
`;

// @ts-ignore
const Container: StyledComponent<'div', any> & ContainerChild = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 17px;
    border: 2px solid var(--card-border-color);
    border-radius: 15px;
    padding: 30px;
    margin-right: 27px;
    max-width: 373px;
    min-width: 340px;
    width: 100%;
    @media (max-width: 1024px) {
        margin-right: 0;
        max-width: 100%;
    }
`;

Container.ColorLabel = ColorLabel;
Container.ButtonContainer = ButtonContainer;

export default Container;
