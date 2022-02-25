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
    margin-top: 20px;
    flex-direction: ${(_props) => (_props.layout ? 'row' : 'column-reverse')};
`;

const ContainerFixed = styled.div`
    height: 130px;
    display: flex;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    position: absolute;
    top: -140px;
`;

const ContainerLeft = styled.div<ContainerProps>`
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 50%;
    max-width: ${(_props) => (_props.layout ? '50%' : '100%')};
`;

const ContainerRight = styled.div<ContainerProps>`
    flex: 1;
    display: flex;
    flex-direction: ${(_props) => (_props.layout ? 'column' : 'row-reverse')};
    padding-left: ${(_props) => (_props.layout ? '80px' : '0')};
    max-width: ${(_props) => (_props.layout ? '50%' : '100%')};
    align-items: center;
    & > div {
        width: ${(_props) => (_props.layout ? '' : 'auto')};
    }
    & > div:nth-child(2) {
        margin: ${(_props) => (_props.layout ? '' : '0 40px')};
    }
`;

Container.Fixed = ContainerFixed;
Container.Right = ContainerRight;
Container.Left = ContainerLeft;

export default Container;
