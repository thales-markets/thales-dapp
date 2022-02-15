import React, { CSSProperties, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { navigateTo } from '../../utils/routes';

type FieldValidationMessageProps = {
    className?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
    style?: CSSProperties;
    href: string;
    target?: string;
    rel?: string;
};

const ifIpfsDeployment = process.env.REACT_APP_IPFS_DEPLOYMENT === 'true';

const SPAAnchor: React.FC<FieldValidationMessageProps> = ({
    onClick,
    children,
    href,
    style,
    className,
    target,
    rel,
}) => {
    return (
        <>
            {ifIpfsDeployment ? (
                <Anchor className={className} style={style} href={href} target={target ?? ''} rel={rel ?? ''}>
                    {children}
                </Anchor>
            ) : (
                <Anchor
                    className={className}
                    style={style}
                    href={href}
                    target={target ?? ''}
                    rel={rel ?? ''}
                    onClick={(event) => {
                        event.preventDefault();
                        onClick && onClick(event);
                        navigateTo(href);
                    }}
                >
                    {children}
                </Anchor>
            )}
        </>
    );
};

const Anchor = styled.a``;

export default SPAAnchor;
