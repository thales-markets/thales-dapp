import styled from 'styled-components';
import { Button } from 'theme/common';

export const SideHeader = styled.h2`
    font-weight: bold;
    font-size: 49px;
    line-height: 64px;
    letter-spacing: -1px;
    color: ${(props) => props.color};
`;
export const SideContent = styled.h2`
    font-weight: normal;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.2px;
    color: ${(props) => props.color};
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

export const SideTitle = styled(SideHeader)`
    letter-spacing: 3px;
`;

export const MarketButton = styled(Button)`
    background: #3936c7;
    color: #ffffff;
    margin-top: 30px;
`;

export const LaunchApp = styled(Button)`
    padding: 8px 35px;
    background: linear-gradient(90deg, #3936c7 4.67%, #2d83d2 42.58%, #23a5dd 77.66%, #35dadb 95.67%);
    color: white;
    margin-right: 20px;
`;

export const WhoIsThales = styled(Button)`
    background: transparent;
    border: 1.5px solid #44e1e2;
    color: #44e1e2;
`;
