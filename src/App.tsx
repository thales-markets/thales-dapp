import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './i18n';
import ROUTES from './constants/routes';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Options from './pages/Options';
import 'semantic-ui-css/semantic.min.css';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path={ROUTES.Options}>
                    <MainLayout>
                        <Options />
                    </MainLayout>
                </Route>
                <Route path={ROUTES.Home}>
                    <MainLayout>
                        <Home />
                    </MainLayout>
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

export default App;
