import styled, { StyledComponent } from 'styled-components';

type ContainerChildren = {
    Date: StyledComponent<'span', any>;
    Time: StyledComponent<'span', any>;
};

// @ts-ignore
const Container: StyledComponent<'div', any> & ContainerChildren = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--color-white);
    width: 110px;
`;

const Date = styled.span`
    display: block;
    font-weight: 700;
    font-size: 15px;
`;

const Time = styled.span`
    display: block;
    font-weight: 300;
    font-size: 15px;
`;

Container.Date = Date;
Container.Time = Time;

export default Container;
