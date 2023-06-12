import React, { lazy, Suspense } from 'react';

const UserWallet = lazy(() => import(/* webpackChunkName: "UserWallet" */ './UserWallet'));
const Notification = lazy(() => import(/* webpackChunkName: "Notification" */ './Notifications'));

const UserCard: React.FC = () => {
    return (
        <>
            <Suspense fallback={<></>}>
                <UserWallet />
            </Suspense>

            <Suspense fallback={<></>}>
                <Notification />
            </Suspense>
        </>
    );
};

export default UserCard;
