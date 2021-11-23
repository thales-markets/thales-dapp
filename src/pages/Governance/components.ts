import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDiv, FlexDivRow } from 'theme/common';

export const SidebarTitle = styled(FlexDivColumnCentered)`
    font-weight: 500;
    font-size: 25px;
    line-height: 48px;
    color: #f6f6fe;
    margin-bottom: 10px;
    text-align: center;
`;

export const SidebarWrapper = styled(FlexDivColumn)`
    background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
    padding: 1px 0 0 0;
`;

export const SidebarScrollWrapper = styled(FlexDivColumn)`
    max-height: 490px;
    overflow: auto;
`;

export const SidebarContainer = styled(FlexDivColumn)`
    padding: 10px 20px 20px 20px;
    background-color: #04045a;
`;

export const SidebarRow = styled(FlexDivColumnCentered)`
    margin: 10px 0;
`;

export const SidebarRowData = styled(FlexDivRow)`
    font-weight: bold;
    font-size: 16px;
    line-height: 36px;
    color: #f6f6fe;
`;

export const Percentage = styled(FlexDiv)`
    text-align: right;
`;

export const RowPercentage = styled.div`
    height: 3px;
    border: 1px solid #4564ae;
    border-radius: 10px;
    background-color: #4564ae;
`;

export const RowPercentageIndicator = styled(FlexDiv)<{ width: number }>`
    height: 5px;
    background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
    width: ${(props) => `${props.width}%`};
    position: absolute;
    border-radius: 10px;
    top: -1px;
    left: 0;
    z-index: 1;
`;

export const Label = styled.div`
    width: 150px;
`;

export const Votes = styled.div``;

export const LoaderContainer = styled(FlexDivColumn)`
    min-height: 400px;
    background: #04045a;
    justify-content: space-evenly;
    position: relative;
`;
