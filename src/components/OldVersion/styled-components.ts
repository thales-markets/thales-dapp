import { TablePagination } from '@material-ui/core';
import styled from 'styled-components';
export const PaginationWrapper = styled(TablePagination)`
    border: none !important;
    display: flex;
    .MuiToolbar-root {
        color: #f6f6fe;
        padding: 0;
        margin-top: 16px;
        display: flex;
        .MuiSelect-icon {
            color: #f6f6fe;
        }
        .MuiTablePagination-spacer {
            display: none;
        }
    }
    .MuiTablePagination-toolbar > .MuiTablePagination-caption:last-of-type {
        display: none;
    }
    .MuiTablePagination-input {
        margin-top: 2px;
    }
    .MuiTablePagination-selectRoot {
        @media (max-width: 767px) {
            margin-left: 0px;
            margin-right: 0px;
        }
    }
`;
