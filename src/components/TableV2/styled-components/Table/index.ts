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
    Body: StyledComponent<'div', any, { leaderboardView?: boolean }>;
    Row: StyledComponent<'div', any, { leaderboardRank?: number; isUser?: boolean }>;
    Cell: StyledComponent<'div', any, CellProps>;
    Arrow: StyledComponent<'i', any>;
};

// @ts-ignore
const Table: StyledComponent<'div', any> & Children = styled.div`
    font-family: Roboto !important;
    font-style: normal;
    width: 100%;
    color: var(--primary-color);
    max-width: 1200px;
`;

const Cell = styled.div<CellProps>`
    justify-content: ${(_props) => (_props.justifyContent ? _props.justifyContent : 'center')};
    align-items: ${(_props) => (_props.alignItems ? _props.alignItems : 'center')};
    font-weight: ${(_props) => (_props.defaultFontWeight ? _props.defaultFontWeight : '300')};
    font-size: ${(_props) => (_props.defaultFontSize ? _props.defaultFontSize : '12px')};
    flex: 1 !important;
    display: flex;
    flex-direction: row;
`;

const Row = styled.div<{ leaderboardRank?: number; isUser?: boolean }>`
    display: flex;
    height: 43px;
    width: 100%;
    align-items: center;
    border-bottom: 1px solid var(--table-border-color);
    ${(_props) => (_props?.leaderboardRank == 1 ? 'height: 130px !important;' : '')};
    ${(_props) => (_props?.leaderboardRank == 2 ? 'height: 66px !important;' : '')};
    ${(_props) => (_props?.leaderboardRank == 3 ? 'height: 66px !important;' : '')};
    ${(_props) =>
        _props?.leaderboardRank
            ? _props?.leaderboardRank < 4
                ? 'border: 2px solid var(--input-border-color) !important;'
                : ''
            : ''};
    ${(_props) => (_props?.leaderboardRank ? (_props.leaderboardRank < 4 ? 'border-radius: 15px;' : '') : '')};
    ${(_props) => (_props?.leaderboardRank == 1 ? 'margin: 15px 0px !important;' : '')};
    ${(_props) => (_props?.leaderboardRank == 2 ? 'margin: 15px 0px !important;' : '')};
    ${(_props) => (_props?.leaderboardRank == 3 ? 'margin: 15px 0px 0px 0px !important;' : '')};
    ${(_props) =>
        _props?.isUser
            ? `
     background-color: #3498db;
     margin-top: 14px;
     box-shadow: var(--shadow);
     border-radius: 15px;
     border: 2px solid var(--input-border-color) !important;
     `
            : ''}
`;

const Body = styled.div<{ leaderboardView?: boolean }>`
    width: 100%;
    ${Row} {
        ${(_props) => (_props?.leaderboardView ? `height: 60px;` : '')};
        ${(_props) => (_props?.leaderboardView ? `font-size: 20px;` : '')};
    }
    ${Cell} {
        ${(_props) => (_props?.leaderboardView ? `font-size: 16px;` : '')};
    }
    /* ${Row}:first-child {
        margin: 15px 0px;
        height: 130px;
        border: 2px solid var(--table-border-color);
        border-radius: 15px;
    }
    ${Row}:nth-child(2) {
        margin: 15px 0px;
        height: 66px;
        border: 2px solid var(--table-border-color);
        border-radius: 15px;
    }
    ${Row}:nth-child(3) {
        margin: 15px 0px 0px 0px;
        height: 66px;
        border: 2px solid var(--table-border-color);
        border-radius: 15px;
    } */
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
