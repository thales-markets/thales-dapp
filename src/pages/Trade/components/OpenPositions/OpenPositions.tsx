import Button from 'components/ButtonV2/Button';
import { USD_SIGN } from 'constants/currency';

import useUserOpenPositions from 'queries/user/useUserOpenPositions';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { CSSProperties } from 'styled-components';
import { formatShortDateFromTimestamp } from 'utils/formatters/date';
import { formatCurrencyWithSign, formatNumberShort } from 'utils/formatters/number';

const OpenPositions: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));

    const positionsQuery = useUserOpenPositions(networkId, walletAddress ?? '', { enabled: true });
    const livePositions = useMemo(() => {
        if (positionsQuery.isSuccess) return positionsQuery.data;
        return [];
    }, [networkId, positionsQuery]);

    console.log(livePositions);

    return (
        <Wrapper>
            <Title>Your Open Positions</Title>
            {livePositions.map((position, index) => {
                return (
                    <Position key={index}>
                        <Icon className={`currency-icon currency-icon--${position.currencyKey.toLowerCase()}`} />
                        <AlignedFlex>
                            <FlexContainer>
                                <Label>{`${position.currencyKey}`}</Label>
                                <Value>{position.strikePrice}</Value>
                            </FlexContainer>
                            <Separator />
                            <FlexContainer>
                                <Label>End Date</Label>
                                <Value>{formatShortDateFromTimestamp(position.maturityDate)}</Value>
                            </FlexContainer>
                            <Separator />
                            <FlexContainer>
                                <Label>Size</Label>
                                <Value>{`${formatNumberShort(position.amount)}  ${position.side}`}</Value>
                            </FlexContainer>
                            <Separator />
                            <FlexContainer>
                                <Label>Paid</Label>
                                <Value>{formatCurrencyWithSign(USD_SIGN, position.paid, 2)}</Value>
                            </FlexContainer>
                        </AlignedFlex>
                        <Button
                            {...defaultButtonProps}
                            disabled={Number(position.value) === 0}
                            additionalStyles={additionalStyle}
                        >
                            Cash Out {formatCurrencyWithSign(USD_SIGN, position.value, 2)}
                        </Button>
                    </Position>
                );
            })}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 20px;
    padding-bottom: 20px;
`;

const Title = styled.span`
    font-family: 'Titillium Web';
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    margin-left: 20px;
    margin-bottom: 10px;
    /* or 13px */

    text-transform: uppercase;

    color: ${(props) => props.theme.textColor.secondary};
`;

const defaultButtonProps = {
    width: '100%',
    height: '27px',
    active: true,
};

const additionalStyle: CSSProperties = {
    maxWidth: '200px',
    fontWeight: 700,
    fontSize: '13px',
    lineHeight: '100%',
    textTransform: 'uppercase',
};

const Position = styled.div`
    background: ${(props) => props.theme.background.primary};
    border: 2px solid ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    gap: 20px;
`;

const Icon = styled.i`
    font-size: 31px;
`;

const AlignedFlex = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: flex-end;
    width: 100%;
`;

const FlexContainer = styled(AlignedFlex)`
    gap: 4px;
    flex: 1;
    justify-content: center;

    &:first-child {
        min-width: 210px;
        max-width: 210px;
    }
`;

const Label = styled.span`
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    text-transform: capitalize;
    color: ${(props) => props.theme.textColor.secondary};
    white-space: nowrap;
`;

const Value = styled(Label)`
    color: ${(props) => props.theme.textColor.primary};
    white-space: nowrap;
`;

const Separator = styled.div`
    width: 2px;
    height: 14px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 3px;
`;

export default OpenPositions;
