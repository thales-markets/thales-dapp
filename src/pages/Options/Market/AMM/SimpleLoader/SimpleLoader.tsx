import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const SimpleLoader: React.FC = () => {
    return <CircularProgress thickness={7} size={16} disableShrink />;
};

export default SimpleLoader;
