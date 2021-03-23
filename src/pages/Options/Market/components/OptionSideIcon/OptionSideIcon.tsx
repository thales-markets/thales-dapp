import React from 'react';
import { ReactComponent as TrendUpIcon } from 'assets/images/trend-up.svg';
import { ReactComponent as TrendDownIcon } from 'assets/images/trend-down.svg';
import { OptionSide } from 'types/options';

type OptionSideIconProps = {
    side: OptionSide;
};

const OptionSideIcon: React.FC<OptionSideIconProps> = ({ side }) => (
    <span style={{ backgroundColor: side === 'long' ? '#10BA97' : '#D94454' }}>
        {side === 'long' ? <TrendUpIcon /> : <TrendDownIcon />}
    </span>
);

export default OptionSideIcon;
