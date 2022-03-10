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
    margin-top: 50px;
`;

const gradient = keyframes`
    0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const ColorLabel = styled.div<{ color?: string }>`
    border-radius: 15px 15px 0px 0px;
    margin: -32px;
    background-size: 400% 400%;
    height: 15px;
    z-index: 0;
    animation: ${gradient} 5s ease infinite;
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
    width: 35%;
`;

Container.ColorLabel = ColorLabel;
Container.ButtonContainer = ButtonContainer;

export default Container;
