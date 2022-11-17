import styled from 'styled-components';
import { FlexDivColumn, FlexDivRow } from 'theme/common';

export const Wrapper = styled(FlexDivColumn)`
    width: 100%;
    align-items: center;
    color: #f6f6fe;
`;

export const Container = styled(FlexDivRow)`
    width: 100%;
    position: relative;
    align-items: start;
    @media (max-width: 767px) {
        width: 95%;
        flex-direction: column;
        align-items: center;
    }
`;
