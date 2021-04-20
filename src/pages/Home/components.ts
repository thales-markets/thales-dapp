import styled from 'styled-components';

export const SideContent = styled.h2`
    font-weight: normal;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.2px;
    color: ${(props) => props.color};
    width: 461px;
`;

export const ListHeader = styled.h2`
    font-weight: bold;
    font-size: 25px;
    line-height: 48px;
    color: #fff;
`;

export const List = styled.ul`
    list-style-position: outside;
    padding-left: 20px;
`;

export const Li = styled.li`
    font-weight: normal;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.2px;
    color: #fff;
`;

export const InfoText = styled.p`
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.2x;
    margin: 40px 0;
    color: #f6f6fe;
`;

export const SideTitle = styled.h2`
    font-family: Open Sans !important;
    font-style: normal;
    font-weight: bold;
    font-size: 72px;
    line-height: 84px;
    color: #f6f6fe;
`;
