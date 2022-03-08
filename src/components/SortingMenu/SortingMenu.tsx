import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';

import { SortOption } from 'types/options';

type SortingMenuProps = {
    items: Array<SortOption>;
    itemClickEventHandler: (index: number) => void;
    setShowSorting: (data: any) => void;
};

const SortingMenu: React.FC<SortingMenuProps> = ({ items, itemClickEventHandler, setShowSorting }) => {
    return (
        <Container>
            {window.innerWidth <= 768 && (
                <OutsideClickHandler onOutsideClick={() => setShowSorting(false)}>
                    <Wrapper>
                        <Title>Filters</Title>
                        {items.map((item, index) => (
                            <>
                                <Item key={index} onClick={() => itemClickEventHandler(index)}>
                                    {item.displayName}
                                    <Arrow
                                        className={`icon ${
                                            item.asc
                                                ? 'icon--arrow-up'
                                                : item.desc
                                                ? 'icon--arrow-down'
                                                : 'icon--double-arrow'
                                        }`}
                                    />
                                </Item>
                            </>
                        ))}
                    </Wrapper>
                </OutsideClickHandler>
            )}
            {window.innerWidth > 768 && (
                <Wrapper>
                    {items.map((item, index) => (
                        <>
                            <Item key={index} onClick={() => itemClickEventHandler(index)}>
                                {item.displayName}
                                <Arrow
                                    className={`icon ${
                                        item.asc
                                            ? 'icon--arrow-up'
                                            : item.desc
                                            ? 'icon--arrow-down'
                                            : 'icon--double-arrow'
                                    }`}
                                />
                            </Item>
                        </>
                    ))}
                </Wrapper>
            )}
        </Container>
    );
};

const Container = styled.div`
    display: block;
    position: relative;
    width: 100%;
    z-index: 1;
    @media (max-width: 768px) {
        max-width: 390px;
    }
`;

const Title = styled.p`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 100%;
    text-transform: uppercase;
    color: #64d9fe;
    @media (min-width: 769px) {
        display: none;
    }
    margin-bottom: 10px;
`;

const Wrapper = styled.div`
    @media (min-width: 769px) {
        width: 100%;
        margin: auto;
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
    }

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
        border: 2px solid rgba(100, 217, 254, 0.5);
        box-sizing: border-box;
        border-radius: 12px;
        padding: 15px 20px;
        min-width: 240px;
        position: absolute;
        top: -40px;
        left: 0;
    }
`;

const Item = styled.div`
    text-transform: uppercase;
    cursor: pointer;
    font-family: Roboto !important;
    font-style: normal;

    @media (min-width: 769px) {
        margin: 0px 20px;
        color: #64d9fe;
    }
    @media (max-width: 768px) {
        font-weight: bold;
        font-size: 12px;
        line-height: 162.5%;
        text-transform: uppercase;
        color: #ffffff;
    }
`;

const Arrow = styled.i`
    margin-left: 5px;
    font-size: 15px;
    text-transform: none;
    @media (min-width: 769px) {
        color: #64d9fe;
    }
    @media (max-width: 768px) {
        color: #ffffff;
    }
`;

export default SortingMenu;
