import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import './i18n';
import { showWalletPopup } from './redux/modules/ui';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        title: {
            flexGrow: 1,
        },
    })
);
const App: React.FunctionComponent = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Thales Demo
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={() => {
                            dispatch(showWalletPopup());
                        }}
                    >
                        {t('header.connect-wallet')}
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default App;
