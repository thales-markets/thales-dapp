import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from '../Header';

type MainLayoutProps = {
    children: React.ReactNode;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => (
    <Container>
        <Header />
        {children}
    </Container>
);

export default MainLayout;
