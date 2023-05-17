import ROUTES from 'constants/routes';
import React, { CSSProperties, MouseEventHandler } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { navigateTo } from '../../utils/routes';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

type FieldValidationMessageProps = {
    className?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
    style?: CSSProperties;
    href: string;
    simpleOnClick?: boolean;
};

const ifIpfsDeployment = process.env.REACT_APP_IPFS_DEPLOYMENT === 'true';

const SPAAnchor: React.FC<FieldValidationMessageProps> = ({
    onClick,
    children,
    href,
    style,
    className,
    simpleOnClick,
}) => {
    const location = useLocation();
    return (
        <>
            {ifIpfsDeployment ? (
                <Anchor className={className} style={style} href={href}>
                    {children}
                </Anchor>
            ) : (
                <Anchor
                    className={className}
                    style={style}
                    href={href}
                    onClick={
                        simpleOnClick
                            ? onClick
                            : async (event) => {
                                  event.preventDefault();
                                  onClick && onClick(event);
                                  if (!href.includes('http')) {
                                      if (location.pathname === ROUTES.Options.Game && href !== ROUTES.Options.Game) {
                                          // @ts-ignore
                                          window?.webSocket?.close();
                                          await delay(100);
                                      }
                                      navigateTo(href);
                                  } else {
                                      window.open(href);
                                  }
                              }
                    }
                >
                    {children}
                </Anchor>
            )}
        </>
    );
};

const Anchor = styled.a`
    color: var(--color-white);
    display: contents;
`;

export default SPAAnchor;
