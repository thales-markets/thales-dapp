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
    width: 120px;
`;

const Date = styled.span`
    display: block;
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const Time = styled.span`
    display: block;
    font-weight: 300;
    font-size: 15px;
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

Container.Date = Date;
Container.Time = Time;

export default Container;
