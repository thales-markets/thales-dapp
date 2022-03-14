import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import { StyledComponent } from 'styled-components';

type Cell = {
    Title: StyledComponent<'div', any, { fontSize?: number }>;
    Value: StyledComponent<'div', any, { fontSize?: number }>;
};

type Children = {
    Cell: StyledComponent<'div', any, { direction?: string; color?: string }> & Cell;
    Title: StyledComponent<'div', any, { lineHidden?: boolean }>;
};

// @ts-ignore
const Tile: StyledComponent<'div', any, { disabled?: boolean; lineHidden?: boolean }> & Children = styled(FlexDiv)<{
    color?: string;
    disabled?: boolean;
    lineHidden?: boolean;
}>`
    position: relative;
    background: ${(props) => props.color || 'transparent'};
    border: 2px solid ${(props) => (props.color ? 'transparent' : 'rgba(100, 217, 254, 0.5)')};
    box-sizing: border-box;
    border-radius: 15px;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    height: 50px;
    opacity: ${(props) => (props.disabled ? '0.5' : '1')};
    margin-left: 40px;
    &:before {
        content: '';
        position: absolute;
        box-sizing: border-box;
        left: -30px;
        top: 50%;
        transform: translateY(-50%);
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 4px solid var(--background);
        background: ${(props) => props.color || '#64d9fe'} !important;
        box-shadow: 0 0 0 3px ${(props) => props.color || '#64d9fe'} !important;
        opacity: ${(props) => (props.color || props.disabled ? '1' : '0.5')} !important;
    }
    &:after {
        content: '';
        position: absolute;
        box-sizing: border-box;
        left: -24px;
        top: -31px;
        width: 2px;
        height: 43px;
        background: #64d9fe;
        opacity: ${(props) => (props.disabled ? '1' : '0.5')} !important;
        display: ${(props) => (props.lineHidden ? 'none' : 'block')} !important;
        @media screen and (max-width: 767px) {
            height: 68px;
        }
    }
    @media screen and (max-width: 767px) {
        flex-direction: column;
        flex-wrap: wrap;
        min-height: 100px;
    }
`;

const Title: StyledComponent<'div', any, { lineHidden?: boolean }> = styled(FlexDiv)<{
    lineHidden?: boolean;
}>`
    color: var(--primary-color) !important;
    font-family: Roboto !important;
    font-weight: bold;
    height: 50px;
    position: relative;
    border: 2px solid transparent;
    margin-bottom: 15px;
    width: 100%;
    align-items: center;
    margin-left: 40px;
    &:before {
        content: '';
        position: absolute;
        box-sizing: border-box;
        left: -30px;
        top: 50%;
        transform: translateY(-50%);
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 4px solid var(--background);
        background: #64d9fe !important;
        box-shadow: 0 0 0 3px #64d9fe !important;
        opacity: 0.5 !important;
    }
    &:after {
        content: '';
        position: absolute;
        box-sizing: border-box;
        left: -24px;
        top: -31px;
        width: 2px;
        height: 43px;
        background: #64d9fe;
        opacity: 0.5;
        display: ${(props) => (props.lineHidden ? 'none' : 'block')} !important;
        @media screen and (max-width: 767px) {
            height: 68px;
            top: -56px;
        }
    }
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
    font-family: Roboto !important;
    white-space: pre;
    font-style: normal;
    font-weight: bold;
    font-size: ${(props) => props.fontSize || '12'}px;
    text-transform: uppercase;
`;

Cell.Title = CellTitle;
Cell.Value = CellValue;
Tile.Cell = Cell;
Tile.Title = Title;

export default Tile;
