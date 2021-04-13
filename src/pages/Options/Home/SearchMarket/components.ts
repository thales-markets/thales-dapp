import styled from 'styled-components';
import { FlexDivColumnCentered } from 'theme/common';

export const Wrapper = styled(FlexDivColumnCentered)`
    background: linear-gradient(90deg, #3936c7 4.67%, #2d83d2 42.58%, #23a5dd 77.66%, #35dadb 95.67%);
    border-radius: 24px;
    width: 840px;
    height: 150px;
    margin: 50px auto 75px;
    text-align: center;
`;

export const SearchTitle = styled.p`
    width: 100%;
    margin: 9px;
    font-weight: 600;
    font-size: 25px;
    line-height: 48px;
    color: #f6f6fe;
`;
export const SerachInput = styled.input`
    height: 65px;
    width: 520px;
    margin: 0 auto 16px;
    border-radius: 16px;
    border: none !important;
    outline: none !important;
    font-weight: 600;
    font-size: 20px;
    line-height: 40px;
    padding: 0 20px;
    letter-spacing: 0.15px;

    /* dusty lavander */

    color: #748bc6;
`;
