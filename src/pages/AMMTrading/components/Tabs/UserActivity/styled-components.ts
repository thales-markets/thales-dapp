import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    margin-top: 10px;
`;

export const DateTimeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.textColor.secondary};
    width: 110px;
`;

export const Date = styled.span`
    display: block;
    font-weight: 700;
    font-size: 13px;
    white-space: nowrap;
`;

export const Time = styled.span`
    display: block;
    font-weight: 300;
    font-size: 13px;
`;
