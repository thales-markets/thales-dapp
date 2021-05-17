import React from 'react';
import styled from 'styled-components';

type UserFilterProps = {
    color?: string;
    img?: string;
    text?: string;
    className?: string;
    onClick?: (param: any) => void;
};

const UserFilter: React.FC<UserFilterProps> = ({ color, img, text, className, onClick }) => {
    return (
        <FiltersWrapper className={className} onClick={onClick}>
            <FiltersIconWrapper color={color}>
                <FiltersIcon src={img}></FiltersIcon>
            </FiltersIconWrapper>
            <FiltersText>{text}</FiltersText>
        </FiltersWrapper>
    );
};

const FiltersWrapper = styled.div`
    position: relative;
    background: #04045a;
    border-radius: 20px;
    padding: 20px 40px;
    height: 160px;
    max-width: 140px;
    min-width: 140px;
    margin: 24px;
    cursor: pointer;
    &.selected,
    &:hover {
        box-sizing: border-box;
        background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
        border: 4px solid #44e1e2;
        padding: 16px 36px;
    }
    &.disabled {
        pointer-events: none;
        &:after {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            width: 100%;
            height: 100%;
            background: rgba(31, 31, 31, 0.4);
            border-radius: 24px;
        }
    }
`;

const FiltersIconWrapper = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: ${(props) => props.color};
    margin: auto;
`;

const FiltersIcon = styled.img`
    display: block;
    position: relative;
    margin: auto;
    top: 16px;
    width: 24px;
    height: 24px;
`;

const FiltersText = styled.p`
    font-weight: bold;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: #f6f6fe;
    margin-top: 16px;
    word-spacing: 100vw;
`;

export default UserFilter;
