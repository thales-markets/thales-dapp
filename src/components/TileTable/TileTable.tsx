import React, { ReactElement } from 'react';
import Container from './styled-components/Container';
import Tile from './styled-components/Tile';
import AssetInfo, { AssetInfoProps } from '../AssetInfo/AssetInfo';
import { FlexDiv, LoaderContainer, NoDataText, NoDataContainer } from 'theme/common';
import SPAAnchor from '../SPAAnchor';
import SimpleLoader from '../SimpleLoader';
import { useTranslation } from 'react-i18next';

type Cell = {
    flexDirection?: string;
    color?: string;
    title?: string;
    titleFontSize?: number;
    value: string | number;
    valueFontSize?: number;
    test?: number;
};

export type TileRow = {
    asset: AssetInfoProps;
    backgroundColor?: string;
    dotColor?: string;
    cells: Cell[];
    disabled?: boolean;
    link?: string;
};

type Properties = {
    firstColumnRenderer?: (row: TileRow | string) => ReactElement;
    lastColumnRenderer?: (row: TileRow | string) => ReactElement;
    rows: (TileRow | string)[];
    isLoading?: boolean;
};

const wrapInAnchor = (child: JSX.Element, href?: string) => {
    return href ? <SPAAnchor href={href}>{child}</SPAAnchor> : child;
};

const TileTable: React.FC<Properties> = ({ firstColumnRenderer, lastColumnRenderer, rows, isLoading }) => {
    const { t } = useTranslation();
    if (!isLoading && !rows.length) {
        return (
            <NoDataContainer>
                <NoDataText>{t('common.no-data-available')}</NoDataText>
            </NoDataContainer>
        );
    }
    return !isLoading ? (
        <Container>
            {rows.map((row, index) => {
                if (typeof row !== 'string') {
                    const cells = row.cells.slice(
                        firstColumnRenderer ? 1 : 0,
                        lastColumnRenderer ? row.cells.length - 1 : row.cells.length
                    );

                    return wrapInAnchor(
                        <FlexDiv>
                            {firstColumnRenderer && firstColumnRenderer(row)}
                            <Tile
                                lineHidden={index === 0}
                                disabled={row.disabled}
                                dotColor={row.dotColor}
                                backgroundColor={row.backgroundColor}
                                key={index}
                            >
                                <AssetInfo {...row.asset} />
                                {cells.map((cell, index) => (
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
                        </FlexDiv>,
                        row.link
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
    ) : (
        <LoaderContainer>
            <SimpleLoader />
        </LoaderContainer>
    );
};

export default TileTable;
