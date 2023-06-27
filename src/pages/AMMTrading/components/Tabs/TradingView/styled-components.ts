import styled from 'styled-components';
import { FlexDiv } from 'styles/common';

export const Container = styled(FlexDiv)`
    width: 100%;
    height: 450px;
    display: flex;
    flex-direction: column;
    font-size: 13px;
`;

export const CopyrightLabel = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.textColor.primary};
    margin-top: 15px;
`;

export const TradingViewLink = styled.a`
    color: ${(props) => props.theme.link.textColor.primary};
    &:hover {
        text-decoration: underline;
    }
    margin-right: 5px;
`;
