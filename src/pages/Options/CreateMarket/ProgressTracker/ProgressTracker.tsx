import React from 'react';
import { FlexDiv, Image, Text } from 'theme/common';
import stateComplete from 'assets/images/state-completed.svg';
import stateCurrent from 'assets/images/state-current.svg';
import stateEmpty from 'assets/images/state-empty.svg';
import styled from 'styled-components';
import './media.scss';
import { useTranslation } from 'react-i18next';
import { getStableCoinForNetwork } from '../../../../utils/currency';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/rootReducer';
import { getNetworkId } from '../../../../redux/modules/wallet';
import { PositionType } from '../CreateMarket';

type ProgressTrackerProps = {
    isWalletAccessEnabled?: boolean;
    isAllowing?: boolean;
    isMarketCreated?: boolean;
    isCreating?: boolean;
    isLongSubmitted?: boolean;
    isLongSubmitting?: boolean;
    isShortSubmitted?: boolean;
    isShortSubmitting?: boolean;
    showLongProcess?: boolean;
    showShortProcess?: boolean;
};

const ProgressTracker: React.FC<ProgressTrackerProps> = (props) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    return (
        <Wrapper>
            <FlexDiv
                className={(props.isMarketCreated ? 'responsive-hide' : '') + ' progress-tracker-step'}
                style={{ alignItems: 'center', position: 'relative', flex: 1 }}
            >
                <Image
                    className={props.isAllowing ? 'blob' : ''}
                    src={props.isWalletAccessEnabled ? stateComplete : stateCurrent}
                ></Image>
                <Line className={props.isWalletAccessEnabled ? 'fill' : ''}></Line>
                <Label className="text-s pale-grey" style={{ left: -36 }}>
                    {t('options.create-market.progress-tracker.approving', {
                        currencyKey: getStableCoinForNetwork(networkId),
                    })}
                </Label>
            </FlexDiv>

            <FlexDiv className="progress-tracker-step" style={{ alignItems: 'center', position: 'relative', flex: 1 }}>
                <Image
                    className={props.isCreating ? 'blob' : ''}
                    src={
                        !props.isWalletAccessEnabled ? stateEmpty : props.isMarketCreated ? stateComplete : stateCurrent
                    }
                ></Image>
                <Line className={props.isMarketCreated ? 'fill' : ''}></Line>
                <Label className="text-s pale-grey">
                    {t('options.create-market.progress-tracker.creating-market')}
                </Label>
            </FlexDiv>
            {!props.showLongProcess && !props.showShortProcess && (
                <FlexDiv
                    className="progress-tracker-step"
                    style={{ alignItems: 'center', position: 'relative', flex: 0 }}
                >
                    <Image src={!props.isMarketCreated ? stateEmpty : stateComplete}></Image>
                    <Label className="text-s pale-grey" style={{ left: -20 }}>
                        {t('options.create-market.progress-tracker.finished')}
                    </Label>
                </FlexDiv>
            )}

            {props.showLongProcess && (
                <FlexDiv
                    className={(!props.isMarketCreated ? 'responsive-hide' : '') + ' progress-tracker-step'}
                    style={{ alignItems: 'center', position: 'relative', flex: props.showShortProcess ? 1 : 0 }}
                >
                    <Image
                        className={props.isLongSubmitting ? 'blob' : ''}
                        src={!props.isMarketCreated ? stateEmpty : props.isLongSubmitted ? stateComplete : stateCurrent}
                    ></Image>
                    {props.showShortProcess && <Line className={props.isLongSubmitted ? 'fill' : ''}></Line>}
                    <Label className="text-s pale-grey">
                        {t('options.create-market.progress-tracker.submitting', {
                            currencyKey: PositionType.UP,
                        })}
                    </Label>
                </FlexDiv>
            )}

            {props.showShortProcess && (
                <FlexDiv
                    className={(!props.isMarketCreated ? 'responsive-hide' : '') + ' progress-tracker-step'}
                    style={{ alignItems: 'center', position: 'relative', flex: 0 }}
                >
                    <Image
                        className={props.isShortSubmitting ? 'blob' : ''}
                        src={
                            (props.showLongProcess && !props.isLongSubmitted) || !props.isMarketCreated
                                ? stateEmpty
                                : props.isShortSubmitted
                                ? stateComplete
                                : stateCurrent
                        }
                    ></Image>
                    <Label className="text-s pale-grey">
                        {t('options.create-market.progress-tracker.submitting', {
                            currencyKey: PositionType.DOWN,
                        })}
                    </Label>
                </FlexDiv>
            )}
        </Wrapper>
    );
};

export default ProgressTracker;

const Wrapper = styled(FlexDiv)`
    margin: 30px 0;
    padding: 0 50px;
    width: 100%;
    align-items: center;
    justify-content: center;
    img {
        width: 24px;
    }
    @media screen and (max-width: 767px) {
        display: block;
        padding: 0 48%;
    }
`;

const Line = styled.div`
    flex: 1;
    height: 5px;
    background: white;
    &.fill {
        background: #3936c7;
    }
    @media screen and (max-width: 767px) {
        width: 4px;
        height: 60px;
        background: #b8c6e5;
        margin-left: 10px;
        margin-top: 21px;
        margin-bottom: -1px;
        border-radius: 10px;
        &.fill {
            background: #3936c7;
        }
    }
`;

const Label = styled(Text)`
    position: absolute;
    top: 40px;
    left: -46px;
    width: 160px;
    @media screen and (max-width: 1024px) {
        left: -40px !important;
        text-align: center;
        width: 100px;
    }
    @media screen and (max-width: 767px) {
        top: 26px;
        text-align: center;
        left: -67px !important;
        width: 160px;
    }
`;
