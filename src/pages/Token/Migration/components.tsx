import styled from 'styled-components';
import { FlexDivCentered } from 'theme/common';

export const ArrowContainer = styled(FlexDivCentered)`
    margin-bottom: 15px;
    margin-top: -5px;
    @media (max-width: 1192px) {
        margin-bottom: 5px;
    }
`;
