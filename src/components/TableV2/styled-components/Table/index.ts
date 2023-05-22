import styled from 'styled-components';
import { StyledComponent } from 'styled-components';
import { FlexDiv } from 'theme/common';

type CellProps = {
    justifyContent?: string;
    alignItems?: string;
    defaultFontWeight?: string;
    defaultFontSize?: string;
    padding?: string;
};

type Children = {
    Header: StyledComponent<'div', any>;
    Body: StyledComponent<'div', any, { leaderboardView?: boolean; isMobile?: boolean }>;
    RowWrapper: any;
    Row: StyledComponent<
        'div',
        any,
        { leaderboardRank?: number; isUser?: boolean; isMobile?: boolean; isClaimed?: boolean }
    >;
    Cell: StyledComponent<'div', any, CellProps>;
    RowMobile: StyledComponent<'div', any>;
    Arrow: StyledComponent<'i', any>;
};

// @ts-ignore
const Table: StyledComponent<'div', any> & Children = styled.div`
    font-family: Roboto !important;
    font-style: normal;
    width: 100%;
    color: var(--color-white);
    max-width: 1200px;
`;

const Cell = styled.div<CellProps>`
    justify-content: ${(_props) => (_props.justifyContent ? _props.justifyContent : 'center')};
    align-items: ${(_props) => (_props.alignItems ? _props.alignItems : 'center')};
    font-weight: ${(_props) => (_props.defaultFontWeight ? _props.defaultFontWeight : '300')};
    font-size: ${(_props) => (_props.defaultFontSize ? _props.defaultFontSize : '12px')};
    padding: ${(_props) => (_props?.padding ? _props.padding : '')};
    flex: 1 !important;
    display: flex;
    flex-direction: row;
`;

const RowMobile = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    :not(:last-child) {
        border-bottom: 1px solid ${(props) => props.theme.background.secondary};
    }
`;

const RowWrapper = styled.div<{ isClaimable?: boolean }>`
    background: ${(_props) =>
        _props?.isClaimable ? 'linear-gradient(rgba(130, 8, 252, 1), rgba(81, 106, 255, 1))' : 'transparent'};
    margin: ${(_props) => (_props?.isClaimable ? '5px 0px 5px 0px' : '')};
    box-shadow: ${(_props) => (_props?.isClaimable ? ' 0px 0px 10px 3px rgba(100, 217, 254, 0.3)' : 'none')};
    padding: 2px 0px 2px 0px;
`;

const Row = styled.div<{ leaderboardRank?: number; isUser?: boolean; isMobile?: boolean; isClaimed?: boolean }>`
    background: var(--background);
    display: flex;
    height: 43px;
    width: 100%;
    align-items: center;
    border-bottom: 1px solid ${(props) => props.theme.background.secondary};
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
                background-color: ${_props.theme.button.background.primary};
                margin-top: 14px;
                border-radius: 15px;
                border: 2px solid ${_props.theme.button.background.primary} !important;
                color: ${_props.theme.button.textColor.primary};
                `
            : ''};
    ${(_props) =>
        _props?.isMobile && !_props?.isUser && (_props?.leaderboardRank ? _props?.leaderboardRank > 3 : true)
            ? `
                margin: 10px 0px;
                border-radius: 15px;
                border: 1px solid ${_props.theme.background.secondary} !important;
            `
            : ''};
    ${(_props) => (_props?.isClaimed ? 'opacity: 0.5' : '')};
    i {
        color: ${(_props) =>
            _props?.isUser ? _props.theme.background.primary : _props.theme.textColor.primary} !important;
    }
`;

const Body = styled.div<{ leaderboardView?: boolean; isMobile?: boolean }>`
    width: 100%;
    ${Row} {
        ${(_props) => (_props?.leaderboardView ? `height: 40px;` : '')};
        ${(_props) => (_props?.leaderboardView ? `font-size: 20px;` : '')};
        ${(_props) => (_props?.isMobile ? 'height: auto !important;' : '')};
        ${(_props) => (_props?.isMobile ? 'flex-direction: column' : '')};
    }

    ${Cell} {
        ${(_props) => (_props?.leaderboardView ? `font-size: 16px;` : '')};
        ${(_props) => (_props?.isMobile ? 'height: auto;' : '')};
        ${(_props) => (_props?.isMobile ? 'margin: 10px 0px;' : '')};
        ${(_props) => (_props?.isMobile ? 'width: 100% !important;' : '')};
    }
    color: ${(props) => props.theme.textColor.primary};
`;

const Header = styled(FlexDiv)`
    ${Cell} {
        font-weight: bold;
        text-transform: uppercase;
        color: var(--table-header-text-color);
    }
    ${Cell} > i {
        color: var(--table-header-text-color);
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
    color: var(--color-white);
    font-size: 24px;
`;

Table.Header = Header;
Table.Body = Body;
Table.RowWrapper = RowWrapper;
Table.Row = Row;
Table.RowMobile = RowMobile;
Table.Cell = Cell;
Table.Arrow = Arrow;

export default Table;
