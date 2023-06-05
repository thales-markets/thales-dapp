import stateComplete from 'assets/images/state-completed.svg';
import stateCurrent from 'assets/images/state-current.svg';
import stateEmpty from 'assets/images/state-empty.svg';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import { getStableCoinForNetwork } from 'utils/currency';

type ProgressTrackerProps = {
    isWalletAccessEnabled?: boolean;
    isAllowing?: boolean;
    isMarketCreated?: boolean;
    isCreating?: boolean;
};

const ProgressTracker: React.FC<ProgressTrackerProps> = (props) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    return (
        <Wrapper>
            <ProgressTrackerStep>
                <Image src={props.isWalletAccessEnabled ? stateComplete : stateCurrent}></Image>
                <Line className={props.isWalletAccessEnabled ? 'fill' : ''}></Line>
                <Label style={{ left: -36 }}>
                    {t('options.create-market.progress-tracker.approving', {
                        currencyKey: getStableCoinForNetwork(networkId),
                    })}
                </Label>
            </ProgressTrackerStep>
            <ProgressTrackerStep>
                <Image
                    src={
                        !props.isWalletAccessEnabled ? stateEmpty : props.isMarketCreated ? stateComplete : stateCurrent
                    }
                ></Image>
                <Line className={props.isMarketCreated ? 'fill' : ''}></Line>
                <Label>{t('options.create-market.progress-tracker.creating-market')}</Label>
            </ProgressTrackerStep>
            <ProgressTrackerStep style={{ flex: 0 }}>
                <Image src={!props.isMarketCreated ? stateEmpty : stateComplete}></Image>
                <Label style={{ left: -20 }}>{t('options.create-market.progress-tracker.finished')}</Label>
            </ProgressTrackerStep>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDiv)`
    margin: 30px 0;
    padding: 0 50px;
    width: 100%;
    align-items: center;
    justify-content: center;
    img {
        width: 24px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: block;
        padding: 0 48%;
    }
`;

const Line = styled.div`
    flex: 1;
    height: 5px;
    background: ${(props) => props.theme.textColor.primary};
    &.fill {
        background: ${(props) => props.theme.background.quaternary};
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 4px;
        height: 60px;
        background: ${(props) => props.theme.textColor.primary};
        margin-left: 10px;
        margin-top: 21px;
        margin-bottom: -1px;
        border-radius: 10px;
        &.fill {
            background: ${(props) => props.theme.background.quaternary};
        }
    }
`;

const Label = styled.p`
    color: ${(props) => props.theme.textColor.primary};
    position: absolute;
    font-size: 16px;
    line-height: 16px;
    top: 40px;
    left: -46px;
    width: 160px;
    strong {
        font-weight: bold;
    }
    @media (max-width: 1024px) {
        left: -40px !important;
        text-align: center;
        width: 100px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        top: 26px;
        text-align: center;
        left: -67px !important;
        width: 160px;
    }
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
`;

const ProgressTrackerStep = styled(FlexDiv)`
    align-items: center;
    position: relative;
    flex: 1;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: block;
        margin-left: -4px;
    }
`;

export default ProgressTracker;
