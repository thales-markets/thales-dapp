import React from 'react';
import { ReactComponent as TrendUpIcon } from 'assets/images/trend-up.svg';
import { ReactComponent as TrendDownIcon } from 'assets/images/trend-down.svg';
import { Side } from 'types/options';

type SideIconProps = {
    side: Side;
};

const SideIcon: React.FC<SideIconProps> = ({ side }) => (
    <span>{side === 'long' ? <TrendUpIcon /> : <TrendDownIcon />}</span>
);

export default SideIcon;
