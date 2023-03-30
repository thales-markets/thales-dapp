import styled from 'styled-components';
import { TablePagination } from '@material-ui/core';

const Pagination = styled(TablePagination)`
    border: none !important;
    display: flex;
    width: 100%;
    max-width: 1200px;
    height: auto;
    color: var(--color-white) !important;
    .MuiIconButton-root.Mui-disabled {
        color: var(--color-tertiary);
    }
    .MuiTablePagination-selectIcon {
        color: var(--color-white);
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
