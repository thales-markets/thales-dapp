import styled from 'styled-components';
import { FlexDiv, FlexDivCentered } from 'theme/common';

type CellProps = {
    justifyContent?: string;
    alignItems?: string;
    fontWeight?: string;
    fontSize?: string;
    padding?: string;
    color?: string;
};

export const TableView = styled.div`
    color: ${(props) => props.theme.textColor.primary};
    width: 100%;
    height: 100%;
    overflow-x: auto;
    position: relative;
    display: flex;
`;

export const TableCell = styled.div<CellProps>`
    display: flex;
    flex: 1 !important;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

export const TableRow = styled(FlexDiv)<{
    isSticky?: boolean;
    isMobile?: boolean;
    isClaimed?: boolean;
    isClaimable?: boolean;
}>`
    flex-direction: ${(props) => (props.isMobile ? 'column' : '')};
    min-height: 35px;
    font-weight: bold;
    font-size: 13px;
    line-height: 16px;
    align-items: center;
    color: ${(props) => (props.isSticky ? props.theme.button.textColor.primary : props.theme.textColor.primary)};
    border: 1px solid
        ${(props) =>
            props.isMobile
                ? props.isSticky
                    ? props.theme.button.borderColor.primary
                    : props.theme.borderColor.primary
                : 'transparent'};
    border-bottom: 1px solid ${(props) => (!props.isSticky ? props.theme.borderColor.primary : 'transparent')};
    background: ${(props) =>
        props.isClaimable
            ? 'linear-gradient(90deg, #36d1dc -1.48%, #5b86e5 102.44%)'
            : props.isSticky
            ? props.theme.button.background.primary
            : 'transparent'};
    border-radius: ${(props) => (props.isClaimable || props.isMobile || props.isSticky ? '15px' : '0px')};
    opacity: ${(props) => (props.isClaimed ? '0.5' : '1')};
    margin: ${(props) => (props.isMobile || props.isSticky ? '10px 0 0 0' : '0')};
    i {
        color: ${(props) => (props.isSticky ? props.theme.button.textColor.primary : props.theme.textColor.primary)};
    }
    @media (max-width: 767px) {
        min-height: 30px;
        font-size: ${(props) => (props.isMobile ? '13px' : '10px')};
    }
`;

export const TableRowMobile = styled.div<{ isSticky?: boolean }>`
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 0 10px;
    :not(:last-child) {
        border-bottom: 1px solid ${(props) => props.theme.borderColor.primary};
    }
    ${TableCell} {
        height: auto;
        margin: 6px 0px;
        width: 100%;
        :first-child {
            justify-content: flex-start;
            color: ${(props) =>
                props.isSticky ? props.theme.button.textColor.primary : props.theme.textColor.secondary};
            text-transform: uppercase;
        }
    }
`;

export const TableHeader = styled(FlexDiv)`
    width: 100%;
    ${TableCell} {
        text-transform: uppercase;
        font-weight: bold;
        color: ${(props) => props.theme.textColor.secondary};
        user-select: none;
        i {
            color: ${(props) => props.theme.textColor.secondary};
        }
    }
    ${TableRow} {
        border-top: 2px solid ${(props) => props.theme.borderColor.primary};
        border-bottom: 2px solid ${(props) => props.theme.borderColor.primary};
        width: 100%;
    }
`;

export const TableBody = styled.div<{ isMobile?: boolean }>`
    width: 100%;
    color: ${(props) => props.theme.textColor.primary};
    overflow: auto;
`;

export const TableArrow = styled.i`
    margin-left: 5px;
    font-size: 10px;
    text-transform: none;
    &.icon--double-arrow {
        font-size: 12px;
    }
`;

export const NoDataContainer = styled(TableRow)`
    justify-content: center;
    padding: 20px 0px;
    font-size: 15px;
    font-weight: bold;
    border: none;
    margin: auto;
`;

export const LoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 220px;
    width: 100%;
`;

export const PaginationContainer = styled.table`
    width: 100%;
`;
