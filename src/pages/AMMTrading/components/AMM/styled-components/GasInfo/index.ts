import styled, { StyledComponent } from 'styled-components';

type RowChildren = {
    Label: StyledComponent<'span', any>;
    Value: StyledComponent<'span', any>;
};

type GasInfoChild = {
    Row: StyledComponent<'div', any> & RowChildren;
};

// @ts-ignore
const Row: StyledComponent<'div', any> & RowChildren = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    line-height: 22px;
`;

const Label = styled.span`
    font-size: 14px;
    font-weight: 400;
    color: ${(props) => props.theme.textColor.primary};
    text-transform: uppercase;
`;

const Value = styled.span`
    font-size: 14px;
    font-weight: 400;
    color: ${(props) => props.theme.textColor.primary};
`;

Row.Label = Label;
Row.Value = Value;

// @ts-ignore
const GasInfo: StyledComponent<'div', any> & GasInfoChild = styled.div`
    display: flex;
    padding: 9px;
    flex-direction: column;
`;

GasInfo.Row = Row;

export default GasInfo;
