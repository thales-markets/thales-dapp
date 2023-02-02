import styled from 'styled-components';
import { TablePagination } from '@material-ui/core';

const Pagination = styled(TablePagination)`
    border: none !important;
    display: flex;
    width: 100%;
    max-width: 1200px;
    height: auto;
    color: var(--primary-color) !important;
    .MuiIconButton-root.Mui-disabled {
        color: var(--disabled-item);
    }
    .MuiTablePagination-selectIcon {
        color: var(--primary-color);
    }
    .MuiIconButton-root {
        @media (max-width: 768px) {
            padding: 5px;
        }
    }
    .MuiTablePagination-selectRoot {
        @media (max-width: 768px) {
            margin-right: 10px;
        }
    }
`;

export default Pagination;
