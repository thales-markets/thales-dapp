import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';

import arrowDown from 'assets/images/filters/arrow-down.svg';

const SortWrapper = styled(FlexDiv)`
    width: 100%;
    align-items: center;
    position: relative;
    border-bottom: 2px solid #f6f6fa;
    margin-right: 14px;
    &:before {
        content: url(${arrowDown});
        position: absolute;
        right: 16px;
        transform: scale(0.9);
    }
`;

const TextWrapper = styled.p`
    height: 40px;
    width: 100%;
    border-radius: 23px;
    border: none !important;
    outline: none !important;
    font-weight: 600;
    font-size: 16px;
    line-height: 38px;
    padding: 0 10px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    padding-left: 20px;
    margin: 2px;
    text-transform: capitalize;
    &::placeholder {
        font-size: 16px;
        color: #f6f6f6;
        opacity: 0.7;
    }
`;

type SortyByMobileProps = {
    filter: string;
    onClick: () => void;
};

export const SortyByMobile: React.FC<SortyByMobileProps> = ({ filter, onClick, children }) => (
    <>
        <SortWrapper className="markets-mobile__sortWrapper" onClick={onClick}>
            <TextWrapper>Sort by: {filter}</TextWrapper>
            {children}
        </SortWrapper>
    </>
);
