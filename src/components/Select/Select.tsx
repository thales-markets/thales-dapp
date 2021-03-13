import React from 'react';
import ReactSelect, { Props } from 'react-select';

const IndicatorSeparator: React.FC = () => null;

function Select<T>(props: Props<T>) {
    return <ReactSelect classNamePrefix="react-select" components={{ IndicatorSeparator }} {...props} />;
}

export default Select;
