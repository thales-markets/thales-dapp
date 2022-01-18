import React from 'react';

import { FlexDivColumn } from 'theme/common';
import UserCard from 'components/UserInfo/v2/UserCard';

const MarketHeader: React.FC = () => {
    return (
        <FlexDivColumn style={{ width: '100%', flex: 'unset' }}>
            <UserCard />
            {/* <Overlay
                onClick={() => {
                    setShowBurdgerMenu(BurgerState.Hide);
                }}
                className={showBurgerMenu === BurgerState.Show ? 'show' : 'hide'}
            /> */}
        </FlexDivColumn>
    );
};

export default MarketHeader;
