import React, { Suspense } from 'react';
import UserWallet from '../UserWallet';
import Notifications from '../Notifications';

const UserCard: React.FC = () => {
    return (
        <>
            <Suspense fallback={<></>}>
                <UserWallet />
            </Suspense>

            <Suspense fallback={<></>}>
                <Notifications />
            </Suspense>
        </>
    );
};

export default UserCard;
