import styled, { StyledComponent } from 'styled-components';

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

const ColorLabel = styled.div<{ color?: string }>`
    border-radius: 15px 15px 0px 0px;
    margin: -32px;
    height: 15px;
    z-index: 0;
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
