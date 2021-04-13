import React from 'react';
import styled from 'styled-components';

const FiltersWrapper = styled.div`
    background: #04045a;
    border-radius: 20px;
    width: 192px;
    height: 240px;
    padding: 36px 40px;
    margin: 24px;
    cursor: pointer;
    &.selected,
    &:hover {
        box-sizing: border-box;
        background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
        border: 4px solid #44e1e2;
        padding: 32px 36px;
    }
`;

const FiltersIconWrapper = styled.div`
    width: 112px;
    height: 112px;
    border-radius: 50%;
    background: ${(props) => props.color};
`;

const FiltersIcon = styled.img`
    display: block;
    position: relative;
    margin: auto;
    top: 42px;
    width: 28px;
    height: 28px;
`;

const FiltersText = styled.p`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #f6f6fe;
    margin-top: 20px;
`;

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

export default UserFilter;
