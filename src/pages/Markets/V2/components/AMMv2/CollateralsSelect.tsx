import React from 'react';
import styled from 'styled-components';

interface ManuCardProps {
    visibility: boolean;
}

export const CollateralsSelect: React.FC<any> = () => {
    return <MenuCard visibility={true}></MenuCard>;
};

const MenuCard = styled.div<ManuCardProps>`
    display: ${({ visibility }) => (visibility ? 'block' : 'none')};
    position: absolute;
    max-width: 280px;
    right: 35px;
    max-height: 95vh;
    overflow-y: auto;
    top: 40px;
    border: 1px solid var(--color-highlight);
    box-sizing: border-box;
    border-radius: 15px;
    z-index: 1000;
    background-color: var(--color-primary);
    --background: var(--color-primary);
    --icon-color: #f7f7f7;
    --shadow-color: 'var(--color-highlight)';
    @media (max-width: 1024px) {
        width: 100%;
        max-width: 100%;
        max-height: unset;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        border-radius: 0;
        border: none;
        position: fixed;
    }
    box-shadow: var(--shadow);
`;
