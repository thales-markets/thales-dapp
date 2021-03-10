import React from 'react';
import Header from '../Header';

type FullScreenMainLayoutProps = {
    children: React.ReactNode;
};

export const FullScreenMainLayout: React.FC<FullScreenMainLayoutProps> = ({ children }) => (
    <>
        <Header />
        {children}
    </>
);

export default FullScreenMainLayout;
