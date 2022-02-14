import React, { CSSProperties, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { navigateTo } from '../../utils/routes';

type FieldValidationMessageProps = {
    className?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
    style?: CSSProperties;
    href: string;
};

const SPAAnchor: React.FC<FieldValidationMessageProps> = ({ onClick, children, href, style, className }) => {
    return (
        <>
            <Anchor
                className={className}
                style={style}
                href={href}
                onClick={(event) => {
                    event.preventDefault();
                    onClick && onClick(event);
                    navigateTo(href);
                }}
            >
                {children}
            </Anchor>
        </>
    );
};

const Anchor = styled.a`
    color: var(--primary-color);
    display: contents;
`;

export default SPAAnchor;
