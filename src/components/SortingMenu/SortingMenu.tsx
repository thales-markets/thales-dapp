import React from 'react';
import styled from 'styled-components';

import { SortOption } from 'types/options';

type SortingMenuProps = {
    items: Array<SortOption>;
    itemClickEventHandler: (index: number) => void;
};

const SortingMenu: React.FC<SortingMenuProps> = ({ items, itemClickEventHandler }) => {
    return (
        <Wrapper>
            {items.map((item, index) => (
                <>
                    <Item key={index} onClick={() => itemClickEventHandler(index)}>
                        {item.displayName}
                        <Arrow
                            className={`icon ${
                                item.asc ? 'icon--arrow-up' : item.desc ? 'icon--arrow-down' : 'icon--double-arrow'
                            }`}
                        />
                    </Item>
                </>
            ))}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 47px;
    border-bottom: 5px solid var(--table-border-color);
    border-top: 5px solid var(--table-border-color);
    font-family: Titillium Regular !important;
    font-size: 12px;
    vertical-align: middle;
    font-weight: bold;
    color: var(--table-header-text-color);
    max-width: 1200px;
    padding-left: 50px;
`;

const Item = styled.div`
    margin: 0px 20px;
    text-transform: uppercase;
    cursor: pointer;
`;

const Arrow = styled.i`
    margin-left: 5px;
    font-size: 15px;
    text-transform: none;
`;

export default SortingMenu;
