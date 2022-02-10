import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import { StyledComponent } from 'styled-components';

type Cell = {
    Title: StyledComponent<'div', any, { fontSize?: number }>;
    Value: StyledComponent<'div', any, { fontSize?: number }>;
};

type Children = {
    Cell: StyledComponent<'div', any, { direction?: string; color?: string }> & Cell;
};

// @ts-ignore
const Tile: StyledComponent<'div', any> & Children = styled(FlexDiv)<{ color?: string }>`
    background: ${(props) => props.color || 'transparent'};
    border: 2px solid ${(props) => (props.color ? 'transparent' : 'rgba(100, 217, 254, 0.5)')};
    box-sizing: border-box;
    border-radius: 15px;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
`;

// @ts-ignore
const Cell: StyledComponent<'div', any> & Cell = styled.div<{ direction?: string; color?: string }>`
    display: flex;
    flex: 1;
    align-items: center;
    flex-direction: ${(props) => props.direction || 'column'};
    gap: ${(props) => (props.direction ? '3px' : '0')};
    color: var(--primary-color) !important;
    justify-content: center;
`;

const CellTitle = styled.div<{ fontSize?: number }>`
    font-family: Titillium Light !important;
    font-style: normal;
    font-size: ${(props) => props.fontSize || '12'}px;
    text-transform: uppercase;
    line-height: 120%;
`;

const CellValue = styled.div<{ fontSize?: number }>`
    font-family: Titillium Regular !important;
    font-style: normal;
    font-weight: bold;
    font-size: ${(props) => props.fontSize || '12'}px;
    text-transform: uppercase;
`;

Cell.Title = CellTitle;
Cell.Value = CellValue;
Tile.Cell = Cell;

export default Tile;
