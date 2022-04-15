import DisplayNameForm from 'layouts/DappLayout/components/DappHeader/DisplayNameForm';
import Wrapper from 'pages/Profile/components/styled-components/UserData';
import React from 'react';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';

const UserInfoTradingCompetition: React.FC<any> = () => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    return (
        <Wrapper style={{ maxWidth: 320, margin: 0 }}>
            <Wrapper.Row>{isWalletConnected && <DisplayNameForm />}</Wrapper.Row>
        </Wrapper>
    );
};

export default UserInfoTradingCompetition;
