import React, { useState } from 'react';
import SPAAnchor from 'components/SPAAnchor';
import styled from 'styled-components';
import { ScreenSizeBreakpoint } from 'enums/ui';

type MenuItem = {
    className?: string;
    href?: string;
    iconName: string;
    label: string;
    onClick?: any;
    simpleOnClick?: boolean;
};

type DappHeaderItemProps = MenuItem & { submenuItems?: MenuItem[] };

const DappHeaderItem: React.FC<DappHeaderItemProps> = ({
    href,
    className,
    iconName,
    label,
    submenuItems,
    onClick,
    simpleOnClick,
}) => {
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
        <SPAAnchor href={href || ''} onClick={onClick} simpleOnClick={simpleOnClick}>
            <MenuItem className={className} margin={iconName === 'wizard' ? '0 0 0 -5px' : ''}>
                <i
                    className={`sidebar-icon icon--${iconName}`}
                    style={iconName == 'optimism' ? { color: 'white' } : {}}
                />
                <Text marginLeft={iconName === 'wizard' ? '25px' : ''}>{label}</Text>
            </MenuItem>
        </SPAAnchor>
    );
};

const MenuItem = styled.li<{ margin?: string }>`
    display: flex;
    align-items: center;
    cursor: pointer;
    ${(props) => (props.margin ? `margin: ${props.margin};` : '')}
    padding: 15px 20px;
    color: ${(props) => props.theme.textColor.primary};
    transition: background 300ms;
    &.selected {
        color: ${(props) => props.theme.background.tertiary};
        .sidebar-icon {
            color: ${(props) => props.theme.background.tertiary};
        }
    }
    .parent-hovered {
        color: ${(props) => props.theme.textColor.primary};
        background: ${(props) => props.theme.background.primary};
    }
    &:hover {
        color: ${(props) => props.theme.textColor.primary};
        .sidebar-icon {
            color: ${(props) => props.theme.textColor.primary};
        }
        background: ${(props) => props.theme.background.primary};
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
        padding: 0 10px;
        &.show {
            display: flex;
        }
        &:hover {
            color: ${(props) => props.theme.background.tertiary};
            .sidebar-icon {
                color: ${(props) => props.theme.background.tertiary};
            }
            background: transparent;
        }
    }
`;

const Text = styled.span<{ marginLeft?: string }>`
    z-index: 0;
    position: relative;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
    letter-spacing: 0.35px;
    white-space: nowrap;
    display: none;
    margin-left: ${(props) => (props.marginLeft ? props.marginLeft : '20px')};
    text-transform: uppercase;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const Arrow = styled.i<{ open: boolean }>`
    display: none;
    position: absolute;
    right: 10px;
    transform: rotate(${(props) => (props.open ? 90 : -90)}deg);
    font-size: 14px;
`;

export default DappHeaderItem;
