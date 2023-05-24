import styled from 'styled-components';
import { TablePagination } from '@material-ui/core';

const Pagination = styled(TablePagination)`
    border: none !important;
    display: flex;
    width: 100%;
    height: auto;
    color: ${(props) => props.theme.textColor.primary} !important;
    .MuiToolbar-root {
        padding: 0;
        display: flex;
        .MuiSelect-icon {
            color: ${(props) => props.theme.textColor.primary};
        }
    }
    .MuiIconButton-root.Mui-disabled {
        color: ${(props) => props.theme.background.secondary};
    }
    .MuiTablePagination-toolbar > .MuiTablePagination-caption:last-of-type {
        display: block;
    }
    .MuiTablePagination-selectRoot {
        @media (max-width: 767px) {
            margin-left: 0px;
            margin-right: 10px;
        }
    }
`;

export default Pagination;
