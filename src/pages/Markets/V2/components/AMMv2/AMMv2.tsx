import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import CurrencyName from 'components/Currency/v2/CurrencyName';
import { USD_SIGN } from 'constants/currency';
import { format } from 'date-fns';
import React, { useState } from 'react';
import styled from 'styled-components';
import transferImg from 'assets/images/transfer.svg';
import { FlexDivCentered, FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { HistoricalOptionsMarketInfo } from 'types/options';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { CollateralsSelect } from './CollateralsSelect';
import Button from 'components/Button/Button';

enum Position {
    UP = 'UP',
    DOWN = 'DOWN',
}

const AMMv2: React.FC<{ market: HistoricalOptionsMarketInfo | undefined }> = ({ market }) => {
    const [position, setPosition] = useState(Position.UP);
    console.log(market);
    return (
        <Wrapper>
            {market ? (
                <FlexDivCentered>
                    <FlexDivColumnCentered style={{ gap: 8, flex: 1 }}>
                        <div>
                            <Label>Maturity Date</Label>
                            <Value>{format(new Date(market?.maturityDate), 'dd/MMM/yyyy')}</Value>
                        </div>
                        <div>
                            <Label>Strike Price</Label>
                            <Value>{formatCurrencyWithSign(USD_SIGN, market.strikePrice)}</Value>
                        </div>
                    </FlexDivColumnCentered>
                    <FlexDivColumnCentered style={{ gap: 8, flex: 1, alignItems: 'flex-end' }}>
                        <CurrencyIcon synthIconStyle={SynthIconStyle} currencyKey={market.currencyKey} />
                        <CurrencyName
                            spanStyle={StyleForAssetLabel}
                            hideAssetName={true}
                            currencyKey={market.currencyKey}
                        />
                    </FlexDivColumnCentered>
                </FlexDivCentered>
            ) : (
                <NoMarket>
                    <PreLabel>ADD A MARKET</PreLabel>
                    <Icon className={`sidebar-icon icon--markets`} />
                    {/* <PostLabel>Choose a market and make your selection.</PostLabel> */}
                </NoMarket>
            )}

            <FlexDivCentered>
                <PositionChooser onClick={setPosition.bind(this, Position.UP)} active={position === Position.UP}>
                    {Position.UP}
                </PositionChooser>
                <PositionChooser onClick={setPosition.bind(this, Position.DOWN)} active={position === Position.DOWN}>
                    {Position.DOWN}
                </PositionChooser>
            </FlexDivCentered>
            <FlexDivColumnCentered style={{ gap: 10, position: 'relative' }}>
                <Input>
                    <FlexDivRow>
                        <p>Pay</p>
                    </FlexDivRow>
                    <FlexDivRow>
                        <InputValue>20</InputValue>
                        <CollateralsSelect></CollateralsSelect>
                    </FlexDivRow>
                </Input>
                <TransferImg src={transferImg} />
                <Input>
                    <FlexDivRow>
                        <p>Pay</p>
                    </FlexDivRow>
                    <FlexDivRow>
                        <InputValue>20</InputValue>
                    </FlexDivRow>
                </Input>
            </FlexDivColumnCentered>
            <Footer>
                <FlexDivRow>
                    <Label>Potential Profit</Label>
                    <Label>20%</Label>
                </FlexDivRow>
                <FlexDivRow>
                    <Label>Skew Impact</Label>
                    <Label>2%</Label>
                </FlexDivRow>
            </Footer>
            <Button disabled={true} {...defaultButtonProps}>
                Connect wallet
            </Button>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    /* border: 2px solid var(--color-highlight);
    border-radius: 15px; */
    padding: 30px;
    margin-right: 27px;
    min-width: 300px;
    max-width: 353px;
    @media (max-width: 1024px) {
        width: 100%;
    }
    gap: 35px;
    background: var(--color-tertiary);
    border-radius: 15px;
`;

const PositionChooser = styled.div<{ active: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 4px 8px;
    width: 150px;
    height: 30px;

    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;

    background: ${(_props) => (_props.active ? 'var(--color-highlight)' : 'transparent')};
    color: ${(_props) => (_props.active ? 'var(--color-primary)' : 'var(--color-highlight)')};
    border: 2px solid var(--color-highlight);
    cursor: pointer;

    &:first-child {
        border-radius: 4px 0px 0px 4px;
    }
    &:last-child {
        border-radius: 0px 4px 4px 0px;
    }
`;

const Input = styled.div`
    width: 100%;
    height: 80px;

    border: 2px solid var(--color-highlight);
    border-radius: 10px;
`;

const NoMarket = styled.div`
    display: flex;
    flex-direction: column;
    gap: 25px;
    align-items: center;
    height: 100%;
    max-height: 92px;
`;

const PreLabel = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    text-transform: uppercase;

    color: var(--color-highlight);
`;

// const PostLabel = styled.p`
//     font-family: 'Roboto';
//     font-style: normal;
//     font-weight: 400;
//     font-size: 16px;
//     line-height: 19px;
//     text-align: center;

//     color: var(--color-highlight-2);
// `;

const Icon = styled.i`
    color: var(--color-highlight);
    font-size: 50px;
`;

const Label = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: -0.015em;
    color: var(--color-white);
`;

const Value = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 21px;
    line-height: 21px;
    letter-spacing: 0.025em;
    color: var(--color-white);
`;

const StyleForAssetLabel: React.CSSProperties = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '21px',
    lineHeight: '21px',
    letterSpacing: '0.025em',
    color: '#f4f4f4',
};

const SynthIconStyle: React.CSSProperties = {
    marginRight: 0,
    width: 42,
    height: 42,
};

const TransferImg = styled.img`
    width: 35px;
    height: 35px;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
`;

const InputValue = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 21px;
    line-height: 32px;
    /* identical to box height */

    display: flex;
    align-items: center;
    letter-spacing: 0.015em;
    color: var(--color-white);
`;

const Footer = styled.div`
    border-top: 2px solid var(--color-white);
    padding-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const defaultButtonProps = {
    padding: '3px 35px',
    active: true,
    margin: '15px auto 0 auto',
    hoverShadow: 'var(--button-shadow)',
    fontSize: '20px',
};

export default AMMv2;
