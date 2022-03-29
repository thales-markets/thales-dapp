import styled from 'styled-components';
import { StyledComponent } from 'styled-components';
import { FlexDiv } from 'theme/common';

type CellProps = {
    justifyContent?: string;
    alignItems?: string;
    defaultFontWeight?: string;
    defaultFontSize?: string;
};

type Children = {
    Header: StyledComponent<'div', any>;
    Body: StyledComponent<'div', any>;
    Row: StyledComponent<'div', any>;
    Cell: StyledComponent<'div', any, CellProps>;
    Arrow: StyledComponent<'i', any>;
};

// @ts-ignore
const Table: StyledComponent<'div', any> & Children = styled.div`
    font-family: Titillium Regular !important;
    font-style: normal;
    width: 100%;
    color: var(--primary-color);
    max-width: 1200px;
`;

const Cell = styled.div<CellProps>`
    text-align: ${(_props) => (_props.justifyContent ? _props.justifyContent : 'center')};
    align-items: ${(_props) => (_props.alignItems ? _props.alignItems : 'center')};
    font-weight: ${(_props) => (_props.defaultFontWeight ? _props.defaultFontWeight : '300')};
    font-size: ${(_props) => (_props.defaultFontSize ? _props.defaultFontSize : '12px')};
    flex: 1 !important;
`;

const Body = styled.div`
    width: 100%;
`;

const Row = styled.div`
    display: flex;
    height: 43px;
    width: 100%;
    align-items: center;
    border-bottom: 1px solid var(--table-border-color);
`;

const Header = styled(FlexDiv)`
    ${Cell} {
        font-weight: bold;
        text-transform: uppercase;
    }
    ${Row} {
        border-bottom: 4px solid var(--table-border-color);
        border-radius: 3px;
    }
`;

const Arrow = styled.i`
    margin-left: 5px;
    font-size: 15px;
    text-transform: none;
`;

export const NoDataContainer = styled.div`
    display: flex;
    width: 100%;
    height: 300px;
    align-items: center;
`;

export const NoDataText = styled.div`
    color: var(--primary-color);
    font-size: 24px;
`;

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;
Table.Arrow = Arrow;

export default Table;
