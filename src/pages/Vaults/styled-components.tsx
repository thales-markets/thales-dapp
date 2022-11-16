import styled from 'styled-components';
import { FlexDivColumn, FlexDivRow } from 'theme/common';

export const Wrapper = styled(FlexDivColumn)`
    width: 100%;
    align-items: center;
    color: #f6f6fe;
`;

export const Container = styled(FlexDivRow)`
    width: 95%;
    position: relative;
    align-items: start;
    @media (max-width: 1440px) {
        width: 95%;
    }
    @media (max-width: 767px) {
        flex-direction: column;
        align-items: center;
    }
`;

export const Title = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    margin-top: 30px;
    margin-bottom: 40px;
`;
