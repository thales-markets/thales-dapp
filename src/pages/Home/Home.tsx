import ROUTES from 'constants/routes';
import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { navigateTo } from 'utils/routes';

export const Home: React.FC = () => (
    <>
        <Segment>
            <Header as="h1">Thales: Options trading Powered by Syntethix</Header>
            <Button
                primary
                onClick={() => {
                    navigateTo(ROUTES.Options.Home);
                }}
            >
                Open dApp
            </Button>
        </Segment>
    </>
);

export default Home;
