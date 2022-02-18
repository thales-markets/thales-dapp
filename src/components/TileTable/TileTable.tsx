import React, { ReactElement } from 'react';
import Container from './styled-components/Container';
import Tile from './styled-components/Tile';
import AssetInfo, { AssetInfoProps } from '../AssetInfo/AssetInfo';
import { FlexDiv } from '../../theme/common';

type Cell = {
    flexDirection?: string;
    color?: string;
    title?: string;
    titleFontSize?: number;
    value: string | number;
    valueFontSize?: number;
    test?: number;
};

type TileRow = {
    asset: AssetInfoProps;
    color?: string;
    cells: Cell[];
    disabled?: boolean;
};

type Properties = {
    firstColumnRenderer?: (row: TileRow | string) => ReactElement;
    lastColumnRenderer?: (row: TileRow | string) => ReactElement;
    rows: (TileRow | string)[];
};

const TileTable: React.FC<Properties> = ({ firstColumnRenderer, lastColumnRenderer, rows }) => {
    return (
        <Container>
            {rows.map((row, index) => {
                if (typeof row !== 'string') {
                    return (
                        <FlexDiv>
                            {firstColumnRenderer && firstColumnRenderer(row)}
                            <Tile lineHidden={index === 0} disabled={row.disabled} color={row.color} key={index}>
                                <AssetInfo {...row.asset} />
                                {row.cells.map((cell, index) => (
                                    <Tile.Cell direction={cell.flexDirection} key={index}>
                                        {cell.title && (
                                            <Tile.Cell.Title fontSize={cell.titleFontSize}>
                                                {cell.title}
                                            </Tile.Cell.Title>
                                        )}
                                        <Tile.Cell.Value fontSize={cell.valueFontSize}>{cell.value}</Tile.Cell.Value>
                                    </Tile.Cell>
                                ))}
                            </Tile>
                            {lastColumnRenderer && lastColumnRenderer(row)}
                        </FlexDiv>
                    );
                } else {
                    return (
                        <FlexDiv>
                            {firstColumnRenderer && firstColumnRenderer(row)}
                            <Tile.Title lineHidden={index === 0} key={index}>
                                {row}
                            </Tile.Title>
                            {lastColumnRenderer && lastColumnRenderer(row)}
                        </FlexDiv>
                    );
                }
            })}
        </Container>
    );
};

export default TileTable;
