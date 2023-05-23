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
    width: 100%;
    color: ${(props) => props.theme.textColor.primary};
    max-width: 1200px;
`;

const Cell = styled.div<CellProps>`
    justify-content: ${(props) => (props.justifyContent ? props.justifyContent : 'center')};
    align-items: ${(props) => (props.alignItems ? props.alignItems : 'center')};
    font-weight: ${(props) => (props.defaultFontWeight ? props.defaultFontWeight : '300')};
    font-size: ${(props) => (props.defaultFontSize ? props.defaultFontSize : '12px')};
    padding: ${(props) => (props?.padding ? props.padding : '')};
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
    background: ${(props) =>
        props?.isClaimable ? 'linear-gradient(rgba(130, 8, 252, 1), rgba(81, 106, 255, 1))' : 'transparent'};
    margin: ${(props) => (props?.isClaimable ? '5px 0px 5px 0px' : '')};
    box-shadow: ${(props) => (props?.isClaimable ? ' 0px 0px 10px 3px rgba(100, 217, 254, 0.3)' : 'none')};
    padding: 2px 0px 2px 0px;
`;

const Row = styled.div<{ leaderboardRank?: number; isUser?: boolean; isMobile?: boolean; isClaimed?: boolean }>`
    background: var(--background);
    display: flex;
    height: 43px;
    width: 100%;
    align-items: center;
    border-bottom: 1px solid ${(props) => props.theme.background.secondary};
    ${(props) => (props?.leaderboardRank == 1 ? 'height: 130px !important;' : '')};
    ${(props) => (props?.leaderboardRank == 2 ? 'height: 66px !important;' : '')};
    ${(props) => (props?.leaderboardRank == 3 ? 'height: 66px !important;' : '')};
    ${(props) =>
        props?.leaderboardRank
            ? props?.leaderboardRank < 4
                ? 'border: 2px solid var(--input-border-color) !important;'
                : ''
            : ''};
    ${(props) => (props?.leaderboardRank ? (props.leaderboardRank < 4 ? 'border-radius: 15px;' : '') : '')};
    ${(props) => (props?.leaderboardRank == 1 ? 'margin: 15px 0px !important;' : '')};
    ${(props) => (props?.leaderboardRank == 2 ? 'margin: 15px 0px !important;' : '')};
    ${(props) => (props?.leaderboardRank == 3 ? 'margin: 15px 0px 0px 0px !important;' : '')};
    ${(props) =>
        props?.isUser
            ? `
                background-color: ${props.theme.button.background.primary};
                margin-top: 14px;
                border-radius: 15px;
                border: 2px solid ${props.theme.button.background.primary} !important;
                color: ${props.theme.button.textColor.primary};
                `
            : ''};
    ${(props) =>
        props?.isMobile && !props?.isUser && (props?.leaderboardRank ? props?.leaderboardRank > 3 : true)
            ? `
                margin: 10px 0px;
                border-radius: 15px;
                border: 1px solid ${props.theme.background.secondary} !important;
            `
            : ''};
    ${(props) => (props?.isClaimed ? 'opacity: 0.5' : '')};
    i {
        color: ${(props) =>
            props?.isUser ? props.theme.background.primary : props.theme.textColor.primary} !important;
    }
`;

const Body = styled.div<{ leaderboardView?: boolean; isMobile?: boolean }>`
    width: 100%;
    ${Row} {
        ${(props) => (props?.leaderboardView ? `height: 40px;` : '')};
        ${(props) => (props?.leaderboardView ? `font-size: 20px;` : '')};
        ${(props) => (props?.isMobile ? 'height: auto !important;' : '')};
        ${(props) => (props?.isMobile ? 'flex-direction: column' : '')};
    }

    ${Cell} {
        ${(props) => (props?.leaderboardView ? `font-size: 16px;` : '')};
        ${(props) => (props?.isMobile ? 'height: auto;' : '')};
        ${(props) => (props?.isMobile ? 'margin: 10px 0px;' : '')};
        ${(props) => (props?.isMobile ? 'width: 100% !important;' : '')};
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
    color: ${(props) => props.theme.textColor.primary};
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
