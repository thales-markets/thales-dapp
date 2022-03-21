import React, { useState } from 'react';
import styled from 'styled-components';
import { Image } from 'theme/common';
import { history } from 'utils/routes';
import queryString from 'query-string';
import snxStakingActiveIcon from 'assets/images/snx-staking-active.png';
import snxStakingIcon from 'assets/images/snx-staking.png';
import stakingActiveIcon from 'assets/images/staking-active.svg';
import stakingIcon from 'assets/images/staking.svg';
import vestingActiveIcon from 'assets/images/vesting-active.svg';
import vestingIcon from 'assets/images/vesting.svg';
import lpActiveIcon from 'assets/images/lp-active.svg';
import lpIcon from 'assets/images/lp.svg';
import lpl2ActiveIcon from 'assets/images/lp-l2-active.svg';
import lpl2Icon from 'assets/images/lp-l2.svg';
import migrationActiveIcon from 'assets/images/migration-active.svg';
import migrationIcon from 'assets/images/migration.svg';
import migratedRewardsActiveIcon from 'assets/images/migrated-rewards-active.svg';
import migratedRewardsIcon from 'assets/images/migrated-rewards.svg';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsOVM } from 'utils/network';
import { RootState } from 'redux/rootReducer';

type TokenNavProps = {
    setSelectedTab: any;
    selectedTab: any;
};

const TokenNavFooter: React.FC<TokenNavProps> = ({ selectedTab, setSelectedTab }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

    const [showNav, setShowNav] = useState(false);

    return (
        <NavFooter>
            <BurgerWrapper onClick={setShowNav.bind(this, !showNav)}>
                <BurgerLine />
                <BurgerLine />
                <BurgerLine />
            </BurgerWrapper>
            {showNav && (
                <Container>
                    <Icon
                        onClick={() => {
                            history.push({
                                pathname: location.pathname,
                                search: queryString.stringify({
                                    tab: 'staking',
                                }),
                            });
                            setSelectedTab('staking');
                        }}
                        src={selectedTab === 'staking' ? stakingActiveIcon : stakingIcon}
                    />
                    <Icon
                        onClick={() => {
                            history.push({
                                pathname: location.pathname,
                                search: queryString.stringify({
                                    tab: 'retro-rewards',
                                }),
                            });
                            setSelectedTab('retro-rewards');
                        }}
                        src={selectedTab === 'retro-rewards' ? snxStakingActiveIcon : snxStakingIcon}
                    />
                    <Icon
                        onClick={() => {
                            history.push({
                                pathname: location.pathname,
                                search: queryString.stringify({
                                    tab: 'vesting',
                                }),
                            });
                            setSelectedTab('vesting');
                        }}
                        src={selectedTab === 'vesting' ? vestingActiveIcon : vestingIcon}
                    />
                    <Icon
                        onClick={() => {
                            history.push({
                                pathname: location.pathname,
                                search: queryString.stringify({
                                    tab: 'lp-staking',
                                }),
                            });
                            setSelectedTab('lp-staking');
                        }}
                        src={
                            selectedTab === 'lp-staking'
                                ? isL2
                                    ? lpl2ActiveIcon
                                    : lpActiveIcon
                                : isL2
                                ? lpl2Icon
                                : lpIcon
                        }
                    />
                    {!isL2 && (
                        <Icon
                            onClick={() => {
                                history.push({
                                    pathname: location.pathname,
                                    search: queryString.stringify({
                                        tab: 'migration',
                                    }),
                                });
                                setSelectedTab('migration');
                            }}
                            src={selectedTab === 'migration' ? migrationActiveIcon : migrationIcon}
                        />
                    )}
                    {isL2 && (
                        <Icon
                            onClick={() => {
                                history.push({
                                    pathname: location.pathname,
                                    search: queryString.stringify({
                                        tab: 'migrated-rewards',
                                    }),
                                });
                                setSelectedTab('migrated-rewards');
                            }}
                            src={selectedTab === 'migrated-rewards' ? migratedRewardsActiveIcon : migratedRewardsIcon}
                        />
                    )}
                </Container>
            )}
        </NavFooter>
    );
};

const NavFooter = styled.div`
    @media (min-width: 767px) {
        display: none;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 85px;
    right: 0;
    width: 100px;
    padding: 0 10px;
    z-index: 1000;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 145px;
    right: 0;
    width: 100px;
`;

const Icon = styled(Image)`
    width: 42px;
    height: 42px;
    padding: 4px;
    background: #8208fc;
    border-radius: 26.1818px;
    margin-top: 4px;
`;

const BurgerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
    box-shadow: 0px 0px 26.1818px 8.72727px rgba(0, 0, 0, 0.25);
    border-radius: 26.1818px;
`;

const BurgerLine = styled.div`
    width: 27px;
    height: 4px;
    background: #ffffff;
    border-radius: 5px;
    &:nth-child(2) {
        margin-top: 4px;
        margin-bottom: 4px;
    }
`;

export default TokenNavFooter;
