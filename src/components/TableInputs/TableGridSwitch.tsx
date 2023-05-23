import React from 'react';
import styled from 'styled-components';

import Switch from 'components/SwitchInput/SwitchInputNew';

type TableGridSwitchProps = {
    labels: Array<string>;
    value: boolean;
    clickEventHandler: () => void;
};

const TableGridSwitch: React.FC<TableGridSwitchProps> = ({ labels, value, clickEventHandler }) => {
    return (
        <Wrapper>
            <Label>{labels[0]}</Label>
            <Switch
                active={value}
                handleClick={() => clickEventHandler()}
                dotBackground={'var(--input-border-color)'}
                borderColor={'var(--input-border-color)'}
            />
            <Label>{labels[1]}</Label>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: normal;
    font-size: 15px;
    margin-right: 15px;
`;

const Label = styled.span`
    color: var(--input-border-color);
    display: block;
    margin: 0px 5px 0px 5px;
`;

export default TableGridSwitch;
