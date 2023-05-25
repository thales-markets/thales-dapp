import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { Arrow, FiltersButton, Item, PositionWrapper, Title, Wrapper } from './styled-components';

type ItemProps = {
    active: boolean;
    onClick: (args: any | undefined) => void;
    title: any;
    sortable?: boolean;
    sortableIndex?: number;
    isSortedDesc?: boolean;
    clearSort?: () => void;
};

type DropdownMenuProps = {
    buttonTitle: string;
    dropdownTitle?: string;
    items: Array<ItemProps> | Array<any>;
    forceOpenDropdown?: boolean;
};

const processSort = (item: ItemProps) => {
    if (item.sortableIndex == 0) {
        item.sortableIndex = 1;
        item.onClick(undefined);
        return;
    }

    if (item.sortableIndex == 1) {
        item.sortableIndex = 2;
        item.onClick(1);
        return;
    }

    if (item.sortableIndex == 2) {
        item.sortableIndex = 0;
        item.clearSort ? item.clearSort() : '';
        return;
    }
};

const MobileDropdownMenu: React.FC<DropdownMenuProps> = ({ buttonTitle, dropdownTitle, items, forceOpenDropdown }) => {
    const [showDropdown, setDropdownVisibility] = useState<boolean>(false);

    return (
        <>
            <FiltersButton visible={!showDropdown} onClick={() => setDropdownVisibility(!showDropdown)}>
                {buttonTitle}
            </FiltersButton>
            {(showDropdown || forceOpenDropdown) && (
                <PositionWrapper>
                    <Wrapper visible={showDropdown}>
                        <OutsideClickHandler onOutsideClick={() => setDropdownVisibility(false)}>
                            <Title>{dropdownTitle ? dropdownTitle : buttonTitle}</Title>
                            {items &&
                                items.map((item: any, index: number) => {
                                    return item.title ? (
                                        <Item
                                            active={item.active ? true : false}
                                            key={index}
                                            onClick={() => {
                                                !item.sortable ? item.onClick() : processSort(item);
                                            }}
                                        >
                                            {item.title}
                                            {item.sortable ? (
                                                <Arrow
                                                    className={`icon ${
                                                        item.sortable
                                                            ? item.sortableIndex == 0
                                                                ? 'icon--double-arrow'
                                                                : item.sortableIndex == 1
                                                                ? 'icon--arrow-up'
                                                                : item.sortableIndex == 2
                                                                ? 'icon--arrow-down'
                                                                : ''
                                                            : ''
                                                    }`}
                                                />
                                            ) : (
                                                ''
                                            )}
                                        </Item>
                                    ) : (
                                        <>{item}</>
                                    );
                                })}
                        </OutsideClickHandler>
                    </Wrapper>
                </PositionWrapper>
            )}
        </>
    );
};

export default MobileDropdownMenu;
