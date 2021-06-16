import React from 'react';
import { OPTIONS_CURRENCY_MAP } from 'constants/currency';
import { OptionSide } from 'types/options';
import styled from 'styled-components';
import { FlexDivCentered } from 'theme/common';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import longIcon from 'assets/images/long_small.svg';
import shortIcon from 'assets/images/short_small.svg';
import { COLORS } from 'constants/ui';

type OptionResultProps = {
    side: OptionSide;
    amount: number;
};

const OptionResult: React.FC<OptionResultProps> = ({ side, amount }) => {
    return (
        <Container className={side} side={side}>
            <InnerContainer>
                <Amount>{formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[side], amount)}</Amount>
                {side === 'long' ? <SideImage src={longIcon} /> : <SideImage src={shortIcon} />}
            </InnerContainer>
        </Container>
    );
};

const Container = styled(FlexDivCentered)<{ side: OptionSide }>`
    border: 3px solid ${(props) => (props.side === 'long' ? COLORS.LONG : COLORS.SHORT)};
    border-radius: 12px;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.5px;
    color: #f6f6fe;
    padding: 16px;
    width: 50%;
    &:first-child {
        margin-right: 20px;
    }
`;

const InnerContainer = styled(FlexDivCentered)`
    max-width: 400px;
`;

const Amount = styled.div`
    margin-right: 8px;
`;

const SideImage = styled.img``;

export default OptionResult;
