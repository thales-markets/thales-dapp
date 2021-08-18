import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import filters from 'assets/images/filters/filters.svg';
import checkmark from 'assets/images/checkmark.svg';

export const SearchWrapper = styled(FlexDiv)`
    width: 100%;
    align-items: center;
    position: relative;
    background: linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6));
    border-radius: 23px;
    margin-right: 14px;
    &:before {
        content: url(${filters});
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

export const DropDownWrapper = styled.div`
    position: absolute;
    top: 60px;
    background: linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6));
    width: 354px;
    padding: 2px;
    z-index: 100;
    border-radius: 15px;
    &:before {
        content: ' ';
        width: 0;
        height: 0;
        position: absolute;
        margin: auto;
        top: -14px;
        left: 0;
        right: 0;
        border-left: 16px solid transparent;
        border-right: 16px solid transparent;
        border-bottom: 16px solid #7067ac;
    }
    &:after {
        content: ' ';
        width: 0;
        height: 0;
        position: absolute;
        margin: auto;
        top: -12px;
        left: 0;
        right: 0;
        border-left: 14px solid transparent;
        border-right: 14px solid transparent;
        border-bottom: 16px solid #04045a;
    }
`;
export const DropDown = styled.div`
    background: #04045a;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    padding: 20px 40px;
    .selected {
        color: #00f9ff !important;
        &:before {
            content: url(${checkmark});
            position: absolute;
            right: 40px;
            transform: scale(0.9);
        }
    }
`;

type CategoryFiltersProps = {
    filter: string;
    onClick: () => void;
};

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({ filter, onClick, children }) => (
    <>
        <SearchWrapper onClick={onClick}>
            <TextWrapper>Category: {filter}</TextWrapper>
            {children}
        </SearchWrapper>
    </>
);
