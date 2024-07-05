import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';

const SpeedV2: React.FC = () => {
    return <Container>Speed Markets V2 is launching soon!</Container>;
};

const Container = styled(FlexDivColumnCentered)`
    font-size: 28px;
    line-height: 120%;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
`;

export default SpeedV2;
