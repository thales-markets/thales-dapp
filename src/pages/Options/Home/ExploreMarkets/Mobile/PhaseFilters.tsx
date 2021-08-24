import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import arrowDown from 'assets/images/filters/arrow-down.svg';

export const SearchWrapper = styled(FlexDiv)`
    width: 100%;
    align-items: center;
    position: relative;
    background: linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6));
    border-radius: 23px;
    margin-left: 14px;
    &:before {
        content: url(${arrowDown});
        position: absolute;
        right: 16px;
        transform: scale(0.9);
    }
`;

export const TextWrapper = styled.p`
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
    background: #04045a;
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

type CategoryFiltersProps = {
    filter: string;
    onClick: () => void;
};

export const PhaseFilters: React.FC<CategoryFiltersProps> = ({ filter, children, onClick }) => (
    <SearchWrapper onClick={onClick}>
        <TextWrapper>Show: {filter}</TextWrapper>
        {children}
    </SearchWrapper>
);
