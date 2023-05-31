import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered } from 'theme/common';

export const VoteRow = styled(FlexDivColumnCentered)`
    padding: 10px;
    :not(:last-child) {
        border-bottom: 1px solid ${(props) => props.theme.borderColor.primary};
    }
`;

export const VoteLabel = styled.div`
    width: 125px;
    @media (max-width: 575px) {
        width: 105px;
    }
`;

export const NoVotes = styled(FlexDivColumn)`
    min-height: 200px;
    background: ${(props) => props.theme.background.primary};
    justify-content: space-evenly;
    align-items: center;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
    border-radius: 15px;
`;
