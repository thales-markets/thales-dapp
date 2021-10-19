import React, { CSSProperties, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { navigateTo } from '../../utils/routes';

type FieldValidationMessageProps = {
    className?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
    style?: CSSProperties;
    path: string;
};

const SPAAnchor: React.FC<FieldValidationMessageProps> = ({ onClick, children, path, style, className }) => {
    return (
        <>
            <Anchor
                className={className}
                style={style}
                href={path}
                onClick={(event) => {
                    event.preventDefault();
                    onClick && onClick(event);
                    navigateTo(path);
                }}
            >
                {children}
            </Anchor>
        </>
    );
};

const Anchor = styled.a`
    display: contents;
`;

export default SPAAnchor;
