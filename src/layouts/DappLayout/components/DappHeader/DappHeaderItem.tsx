import React, { useState } from 'react';
import SPAAnchor from '../../../../components/SPAAnchor';
import styled from 'styled-components';

type MenuItem = {
    className?: string;
    href?: string;
    iconName: string;
    label: string;
};

type DappHeaderItemProps = MenuItem & { submenuItems?: MenuItem[] };

const DappHeaderItem: React.FC<DappHeaderItemProps> = ({ href, className, iconName, label, submenuItems }) => {
    const [showSubmenu, setShowSubmenu] = useState(false);

    if (submenuItems) {
        const parentClassName = !!submenuItems.find((submenu) => !!submenu.className) ? 'selected' : '';

        return (
            <>
                <MenuItem onClick={() => setShowSubmenu(!showSubmenu)} className={showSubmenu ? '' : parentClassName}>
                    <i className={`sidebar-icon icon--${iconName}`} />
                    <Text>{label}</Text>
                    <Arrow open={showSubmenu} className={'icon icon--left'} />
                </MenuItem>
                {showSubmenu &&
                    submenuItems.map((submenu) => (
                        <SPAAnchor key={submenu.iconName} href={submenu.href || ''}>
                            <MenuItem className={!showSubmenu ? 'parent-hovered' : submenu.className}>
                                <i className={`sidebar-icon icon--${submenu.iconName}`} />
                                <Text>{submenu.label}</Text>
                            </MenuItem>
                        </SPAAnchor>
                    ))}
            </>
        );
    }
    return (
        <SPAAnchor href={href || ''}>
            <MenuItem className={className}>
                <i className={`sidebar-icon icon--${iconName}`} />
                <Text>{label}</Text>
            </MenuItem>
        </SPAAnchor>
    );
};

const MenuItem = styled.li`
    display: flex;
    align-items: center;
    height: 70px;
    cursor: pointer;
    padding: 14px;
    color: #f6f6fe;
    transition: background 300ms;
    &.selected {
        color: #04045a;
    }
    .parent-hovered {
        color: #f6f6fe;
        background: #141c7f;
    }
    &:hover {
        color: #f6f6fe;
        background: #141c7f;
    }
`;

const Text = styled.span`
    z-index: 0;
    position: relative;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
    letter-spacing: 0.35px;
    white-space: nowrap;
    display: none;
    margin-left: 20px;
    text-transform: uppercase;
`;

const Arrow = styled.i<{ open: boolean }>`
    display: none;
    position: absolute;
    right: 10px;
    transform: rotate(${(props) => (props.open ? 90 : -90)}deg);
    font-size: 14px;
`;

export default DappHeaderItem;
