import React from 'react';
import ReactSelect, { OptionTypeBase, Props } from 'react-select';

const IndicatorSeparator: React.FC = () => null;

function Select(props: Props<OptionTypeBase>) {
    return <ReactSelect classNamePrefix="react-select" components={{ IndicatorSeparator }} {...props} />;
}

export default Select;
