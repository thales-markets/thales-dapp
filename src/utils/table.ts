import { SortOption } from 'types/options';
import { get } from './localStore';

export type TableColumnSort = {
    id: string;
    desc: boolean | undefined;
    isMultiSort: boolean;
};

export const saveTableSort = (lolcaStorageKey: string, columnAction: TableColumnSort) => {
    const lolcaStorageValue = get(lolcaStorageKey) as [];
    const previousSort: TableColumnSort[] = lolcaStorageValue || [];

    // when multisort is changed from true to false next desc state on column is always false
    if (previousSort.length > 0 && previousSort[0].isMultiSort && !columnAction.isMultiSort) {
        columnAction.desc = false;
    } else {
        // desc contains prev state, so cycle is: undefined (no sort) => false (asc) => true (desc) => undefined
        columnAction.desc = columnAction.desc === undefined ? false : columnAction.desc ? undefined : true;
    }

    const index = previousSort.findIndex((col: any) => col.id === columnAction.id);
    if (index === -1) {
        previousSort.push(columnAction);
    }
    const sortedColumns = previousSort
        // set multi sort on all columns and update column desc for current column
        .map((col: any) =>
            col.id === columnAction.id
                ? { ...col, desc: columnAction.desc, isMultiSort: columnAction.isMultiSort }
                : { ...col, isMultiSort: columnAction.isMultiSort }
        )
        .filter((col) =>
            // remove columns only with undefined desc state if it is multisort, otherwise keep only current if it has sort
            columnAction.isMultiSort ? col.desc !== undefined : col.id === columnAction.id && col.desc !== undefined
        );

    localStorage.setItem(lolcaStorageKey, JSON.stringify(sortedColumns));
};

export const mapTableToGridSort = (tableSort: TableColumnSort[], gridSort: Array<SortOption>): Array<SortOption> => {
    const gridSortFormat = [...gridSort];
    // Map Table sort to Grid sort filters
    if (tableSort && tableSort.length > 0) {
        const index = gridSortFormat.findIndex((element) => {
            return element.property === (tableSort[0].id === 'currentPrice' ? 'currentAssetPrice' : tableSort[0].id);
        });
        if (index > -1) {
            gridSortFormat[index].asc = !tableSort[0].desc;
            gridSortFormat[index].desc = !!tableSort[0].desc;
        }
    }

    return gridSortFormat;
};

export const mapGridToTableSort = (gridSort: SortOption): TableColumnSort[] => {
    const tableSortFormat: TableColumnSort[] = [];
    if (gridSort.asc || gridSort.desc) {
        tableSortFormat.push({
            id: gridSort.property === 'currentAssetPrice' ? 'currentPrice' : gridSort.property,
            desc: gridSort.desc,
            isMultiSort: false,
        });
    }

    return tableSortFormat;
};
