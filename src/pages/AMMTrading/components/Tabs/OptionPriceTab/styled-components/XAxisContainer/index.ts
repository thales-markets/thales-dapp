import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';
import { StyledComponent } from 'styled-components';

type Children = {
    Tick: StyledComponent<'div', any> & TickChildren;
};

type TickChildren = {
    Day: StyledComponent<'div', any>;
    DayNumerical: StyledComponent<'div', any>;
    Divider: StyledComponent<'div', any>;
};

// @ts-ignore
const Tick: StyledComponent<'div', any> & TickChildren = styled(FlexDivColumn)`
    flex-direction: column;
    align-items: center;
    flex: unset;
`;

// @ts-ignore
const XAxisContainer: StyledComponent<'div', any> & Children = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: 50px;
    ${Tick}:first-child {
        margin-left: -16px;
    }
    ${Tick} {
        margin-right: calc((95% / 7) - 34px);
    }
    &:last-child {
        margin-right: 0px !important;
    }
`;

const Day = styled.div`
    color: var(--primary-color);
    font-size: 16px;
`;

const DayNumerical = styled.div`
    color: var(--input-border-color);
    font-size: 15px;
    margin: 10px 0px;
`;

const Divider = styled.div`
    background-color: var(--primary-color);
    width: 6px;
    height: 80px;
    border-radius: 5px;
`;

Tick.Day = Day;
Tick.DayNumerical = DayNumerical;
Tick.Divider = Divider;

XAxisContainer.Tick = Tick;

export default XAxisContainer;
