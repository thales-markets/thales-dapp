import { Network } from 'enums/network';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OutsideClickHandler from 'react-outside-click-handler';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import styled from 'styled-components';

type PeriodDropdownProps = {
    period: number;
    setPeriod: React.Dispatch<React.SetStateAction<number>>;
    allPeriods: number[];
};

const PeriodDropdown: React.FC<PeriodDropdownProps> = ({ period, setPeriod, allPeriods }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [open, setOpen] = useState(false);

    return (
        <OutsideWrapper>
            <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
                <Wrapper onClick={() => setOpen(!open)}>
                    {open ? (
                        allPeriods.map((periodLocal, index) => {
                            if (periodLocal >= 0) {
                                return (
                                    <Container
                                        selected={periodLocal === period}
                                        onClick={setPeriod.bind(this, periodLocal)}
                                        key={index}
                                    >
                                        <Text>
                                            {t('thales-token.gamified-staking.rewards.leaderboard.round')}{' '}
                                            {networkId === Network.Base ? periodLocal + 1 : periodLocal}
                                        </Text>
                                    </Container>
                                );
                            }
                        })
                    ) : (
                        <Container>
                            <Text>
                                {t('thales-token.gamified-staking.rewards.leaderboard.round')}{' '}
                                {networkId === Network.Base ? period + 1 : period}
                            </Text>
                            <Icon className={open ? `icon icon--caret-up` : `icon icon--caret-down`} />
                        </Container>
                    )}
                </Wrapper>
            </OutsideClickHandler>
        </OutsideWrapper>
    );
};

const OutsideWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const Wrapper = styled.div`
    position: absolute;
    top: 0;
    z-index: 1000;
    background: ${(props) => props.theme.background.primary};
    border: 1px solid ${(props) => props.theme.borderColor.tertiary};
    border-radius: 8px;
    width: 100%;
`;

const Text = styled.p`
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%;
    color: ${(props) => props.theme.textColor.primary};
`;

const Container = styled.div<{ selected?: boolean }>`
    height: 36px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    &:hover {
        background: ${(props) => props.theme.background.secondary};
    }
    background: ${(props) => (props.selected ? props.theme.background.secondary : '')};
    cursor: pointer;
`;

const Icon = styled.i`
    font-size: 12px;
    color: ${(props) => props.theme.borderColor.tertiary};
`;

export default PeriodDropdown;
