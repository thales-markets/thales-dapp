import React, { ReactElement } from 'react';
import {
    Container,
    Cell,
    CellTitle,
    CellValue,
    LoaderContainer,
    NoDataContainer,
    Tile,
    Title,
} from './styled-components';
import AssetInfo, { AssetInfoProps } from '../AssetInfo/AssetInfo';
import { FlexDiv } from 'theme/common';
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
    asset?: AssetInfoProps;
    backgroundColor?: string;
    dotColor?: string;
    cells: Cell[];
    disabled?: boolean;
    link?: string;
    heightSmall?: boolean;
};

type Properties = {
    firstColumnRenderer?: (row: TileRow | string) => ReactElement;
    lastColumnRenderer?: (row: TileRow | string) => ReactElement;
    rows: (TileRow | string)[];
    isLoading?: boolean;
    noResultsMessage?: string;
    defaultFlowColor?: string;
};

const wrapInAnchor = (child: JSX.Element, index: number, href?: string) => {
    return href ? (
        <SPAAnchor href={href} key={index}>
            {child}
        </SPAAnchor>
    ) : (
        child
    );
};

const TileTable: React.FC<Properties> = ({
    firstColumnRenderer,
    lastColumnRenderer,
    rows,
    isLoading,
    noResultsMessage,
    defaultFlowColor,
}) => {
    const { t } = useTranslation();

    let isPrevRowTitle = false;

    return isLoading ? (
        <LoaderContainer>
            <SimpleLoader />
        </LoaderContainer>
    ) : rows.length === 0 ? (
        <NoDataContainer>{noResultsMessage || t('common.no-data-available')}</NoDataContainer>
    ) : (
        <Container>
            {rows.map((row, index) => {
                if (typeof row !== 'string') {
                    const lineSmall = isPrevRowTitle;
                    isPrevRowTitle = false;
                    const cells = row.cells.slice(
                        firstColumnRenderer ? 1 : 0,
                        lastColumnRenderer ? row.cells.length - 1 : row.cells.length
                    );

                    return wrapInAnchor(
                        <FlexDiv key={index}>
                            {firstColumnRenderer && firstColumnRenderer(row)}
                            <Tile
                                lineHidden={index === 0}
                                disabled={row.disabled}
                                dotColor={row.dotColor}
                                backgroundColor={row.backgroundColor}
                                heightSmall={row.heightSmall}
                                defaultFlowColor={defaultFlowColor}
                                lineSmall={lineSmall}
                                key={index}
                            >
                                {row.asset && <AssetInfo {...row.asset} />}
                                {cells.map((cell, index) => (
                                    <Cell direction={cell.flexDirection} key={index}>
                                        {cell.title && (
                                            <CellTitle fontSize={cell.titleFontSize}>{cell.title}</CellTitle>
                                        )}
                                        <CellValue fontSize={cell.valueFontSize}>{cell.value}</CellValue>
                                    </Cell>
                                ))}
                            </Tile>
                            {lastColumnRenderer && lastColumnRenderer(row)}
                        </FlexDiv>,
                        index,
                        row.link
                    );
                } else {
                    isPrevRowTitle = true;
                    return (
                        <FlexDiv key={index}>
                            {firstColumnRenderer && firstColumnRenderer(row)}
                            <Title lineHidden={index === 0} defaultFlowColor={defaultFlowColor} key={index}>
                                {row}
                            </Title>
                            {lastColumnRenderer && lastColumnRenderer(row)}
                        </FlexDiv>
                    );
                }
            })}
        </Container>
    );
};

export default TileTable;
