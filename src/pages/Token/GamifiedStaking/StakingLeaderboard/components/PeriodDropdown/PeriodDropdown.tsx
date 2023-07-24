import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';

type PeriodDropdownProps = {
    period: number;
    setPeriod: React.Dispatch<React.SetStateAction<number>>;
    allPeriods: number[];
};

const PeriodDropdown: React.FC<PeriodDropdownProps> = ({ period, setPeriod, allPeriods }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    return (
        <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
            <Wrapper onClick={() => setOpen(!open)}>
                <Container>
                    <Text>
                        {t('thales-token.gamified-staking.rewards.leaderboard.round')} {period}
                    </Text>
                    <Icon className={open ? `icon icon--caret-up` : `icon icon--caret-down`} />
                </Container>

                {open ? (
                    allPeriods.map((periodLocal, index) => {
                        if (periodLocal === period) return <></>;
                        return (
                            <Container onClick={setPeriod.bind(this, periodLocal)} key={index}>
                                <Text>
                                    {t('thales-token.gamified-staking.rewards.leaderboard.round')} {periodLocal}
                                </Text>
                            </Container>
                        );
                    })
                ) : (
                    <></>
                )}
            </Wrapper>
        </OutsideClickHandler>
    );
};

const Wrapper = styled.div`
    border: 1px solid ${(props) => props.theme.borderColor.tertiary};
    border-radius: 8px;
    margin-bottom: 50px;
    max-width: 350px;
`;

const Text = styled.p`
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%;
    color: ${(props) => props.theme.textColor.primary};
`;

const Container = styled.div`
    height: 36px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover {
        background: ${(props) => props.theme.background.secondary};
        border-radius: 8px;
    }
    cursor: pointer;
`;

const Icon = styled.i`
    font-size: 12px;
    color: ${(props) => props.theme.borderColor.tertiary};
`;

export default PeriodDropdown;
