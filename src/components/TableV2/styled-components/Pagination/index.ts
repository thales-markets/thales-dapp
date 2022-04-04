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
`;

export default Pagination;
