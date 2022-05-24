import styled from 'styled-components';
import { FlexDiv } from 'theme/common';

export const Container = styled(FlexDiv)`
    width: 100%;
    height: 600px;
    display: flex;
    flex-direction: column;
`;

export const CopyrightLabel = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    margin-top: 20px;
`;

export const TradingViewLink = styled.a`
    text-decoration: underline;
    color: var(--input-border-color);
    margin-right: 5px;
`;
