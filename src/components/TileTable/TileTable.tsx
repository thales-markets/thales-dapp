import React from 'react';
import Container from './styled-components/Container';
import Tile from './styled-components/Tile';
import AssetInfo, { AssetInfoProps } from '../AssetInfo/AssetInfo';

type Cell = {
    flexDirection?: string;
    color?: string;
    title?: string;
    titleFontSize?: number;
    value: string;
    valueFontSize?: number;
    test?: number;
};

type TileRow = {
    asset: AssetInfoProps;
    color?: string;
    cells: Cell[];
};

type Properties = {
    rows: (TileRow | string)[];
};

const TileTable: React.FC<Properties> = ({ rows }) => {
    return (
        <Container>
            {rows.map((row, index) => {
                if (typeof row !== 'string') {
                    return (
                        <Tile color={row.color} key={index}>
                            <AssetInfo {...row.asset} />
                            {row.cells.map((cell, index) => (
                                <Tile.Cell direction={cell.flexDirection} key={index}>
                                    {cell.title && (
                                        <Tile.Cell.Title fontSize={cell.titleFontSize}>{cell.title}</Tile.Cell.Title>
                                    )}
                                    <Tile.Cell.Value fontSize={cell.valueFontSize}>{cell.value}</Tile.Cell.Value>
                                </Tile.Cell>
                            ))}
                        </Tile>
                    );
                } else {
                    return <Tile.Title>{row}</Tile.Title>;
                }
            })}
        </Container>
    );
};

export default TileTable;
