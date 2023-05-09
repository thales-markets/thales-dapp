import useUserOpenPositions from 'queries/user/useUserOpenPositions';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';

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
            {livePositions.map((position, index) => {
                return (
                    <Position key={index}>
                        <Icon className={`currency-icon currency-icon--${position.currencyKey.toLowerCase()}`} />
                        <AlignedFlex>
                            <AlignedFlex>
                                <Label>{`${position.currencyKey} ${position.side}`}</Label>
                                <Value>{position.strikePrice}</Value>
                            </AlignedFlex>
                            <Separator />
                            <AlignedFlex>
                                <Label>End Date</Label>
                                <Value>{position.strikePrice}</Value>
                            </AlignedFlex>
                            <Separator />
                            <AlignedFlex>
                                <Label>Size</Label>
                                <Value>{position.strikePrice}</Value>
                            </AlignedFlex>
                            <Separator />
                            <AlignedFlex>
                                <Label>{`${position.currencyKey} ${position.side}`}</Label>
                                <Value>{position.strikePrice}</Value>
                            </AlignedFlex>
                        </AlignedFlex>
                    </Position>
                );
            })}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Position = styled.div`
    background: ${(props) => props.theme.background.primary};
    border: 1px solid ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
`;

const Icon = styled.i`
    font-size: 31px;
`;

const AlignedFlex = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Label = styled.span`
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    /* or 13px */

    text-transform: capitalize;

    color: ${(props) => props.theme.textColor.secondary};
`;

const Value = styled(Label)`
    color: ${(props) => props.theme.textColor.primary};
`;

const Separator = styled.div`
    width: 2px;
    height: 14px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 3px;
`;

export default OpenPositions;
