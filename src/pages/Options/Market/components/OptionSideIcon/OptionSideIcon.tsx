import React from 'react';
import { ReactComponent as TrendUpIcon } from 'assets/images/trend-up.svg';
import { ReactComponent as TrendDownIcon } from 'assets/images/trend-down.svg';
import { OptionSide } from 'types/options';
import styled from 'styled-components';

type OptionSideIconProps = {
    side: OptionSide;
};

const OptionSideIcon: React.FC<OptionSideIconProps> = ({ side }) => (
    <Container side={side}>{side === 'long' ? <TrendUpIcon /> : <TrendDownIcon />}</Container>
);

const Container = styled.span<{ side: OptionSide }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    width: 16px;
    height: 16px;
    background-color: ${(props) => (props.side === 'long' ? '#10BA97' : '#D94454')};
    color: '#0E0D14';
`;

export default OptionSideIcon;
