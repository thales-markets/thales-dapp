import styled, { StyledComponent } from 'styled-components';

type ContainerProps = {
    layout: boolean;
};

type Children = {
    Fixed: StyledComponent<'div', any>;
    Left: StyledComponent<'div', any>;
    Right: StyledComponent<'div', any>;
};

// @ts-ignore
const Container: any & Children = styled.div<ContainerProps>`
    position: relative;
    display: flex;
    width: 100%;
    margin-top: 50px;
    flex-direction: ${(_props) => (_props.layout ? 'row' : 'column-reverse')};
    @media (max-width: 1250px) {
        margin-top: 0;
        flex-direction: column-reverse;
    }
    *::-webkit-scrollbar-track {
        border-radius: 8px;
    }
`;

const ContainerFixed = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    max-width: 400px;
    top: -40px;
    @media (max-width: 1250px) {
        display: none;
    }
`;

const ContainerLeft = styled.div<ContainerProps>`
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 50%;
    max-width: ${(_props) => (_props.layout ? '50%' : '100%')};
    @media (max-width: 1250px) {
        max-width: 100%;
    }
`;

const ContainerRight = styled.div<ContainerProps>`
    flex: 1;
    display: flex;
    flex-direction: ${(_props) => (_props.layout ? 'column' : 'row-reverse')};
    padding-left: ${(_props) => (_props.layout ? '80px' : '0')};
    max-width: ${(_props) => (_props.layout ? '50%' : '100%')};
    align-items: center;
    & > div:nth-child(2) {
        margin: ${(_props) => (_props.layout ? '' : '0 20px')};
    }
    @media (max-width: 1250px) {
        max-width: 100%;
        flex-direction: row;
        padding-left: 0;
    }
`;

Container.Fixed = ContainerFixed;
Container.Right = ContainerRight;
Container.Left = ContainerLeft;

export default Container;
