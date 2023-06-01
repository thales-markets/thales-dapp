import React from 'react';
import styled, { useTheme } from 'styled-components';

import Switch from 'components/SwitchInput/SwitchInput';
import { ThemeInterface } from 'types/ui';

type TableGridSwitchProps = {
    labels: Array<string>;
    value: boolean;
    clickEventHandler: () => void;
};

const TableGridSwitch: React.FC<TableGridSwitchProps> = ({ labels, value, clickEventHandler }) => {
    const theme: ThemeInterface = useTheme();
    return (
        <Wrapper>
            <Label>{labels[0]}</Label>
            <Switch active={value} handleClick={() => clickEventHandler()} borderColor={theme.borderColor.primary} />
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
    color: ${(props) => props.theme.textColor.primary};
    display: block;
    margin: 0px 5px 0px 5px;
`;

export default TableGridSwitch;
