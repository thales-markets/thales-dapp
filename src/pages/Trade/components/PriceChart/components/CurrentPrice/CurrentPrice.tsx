import { USD_SIGN } from 'constants/currency';
import React from 'react';
import styled, { css } from 'styled-components';
import { formatCurrencyWithSign } from 'utils/formatters/number';

type CurrentPriceProps = {
    asset: string;
    currentPrice: number | undefined;
    animatePrice?: boolean;
    isPriceUp?: boolean;
};

const CurrentPrice: React.FC<CurrentPriceProps> = ({ asset, currentPrice, animatePrice, isPriceUp }) => {
    const currentPriceFormatted = formatCurrencyWithSign(USD_SIGN, currentPrice || 0);

    return (
        <Container>
            <Icon className={`currency-icon currency-icon--${asset.toLowerCase()}`} />
            {animatePrice ? (
                <>
                    <AnimatedPrice key={currentPrice}>
                        {currentPriceFormatted.split('').map((letter: string, index) =>
                            isNaN(parseInt(letter)) ? (
                                <Price isUp={isPriceUp} key={`priceLetter${index}`}>
                                    {letter}
                                </Price>
                            ) : (
                                <PriceNumber
                                    priceLength={currentPriceFormatted.length}
                                    isUp={isPriceUp}
                                    key={`priceNumber${index}`}
                                >
                                    <i>1</i>
                                    <i>2</i>
                                    <i>3</i>
                                    {letter}
                                </PriceNumber>
                            )
                        )}
                    </AnimatedPrice>
                    <Icon className="icon icon--arrow" isUp={isPriceUp} />
                </>
            ) : (
                <Price>{currentPrice ? currentPriceFormatted : 'N/A'}</Price>
            )}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
`;

const AnimatedPrice = styled.div`
    display: block;
    overflow: hidden;
`;

const Icon = styled.i<{ isUp?: boolean }>`
    font-size: ${(props) => (props.isUp !== undefined ? '22' : '28')}px;
    ${(props) =>
        props.isUp !== undefined
            ? `color: ${props.isUp ? props.theme.positionColor.up : props.theme.positionColor.down};`
            : ''}
    ${(props) =>
        props.isUp !== undefined ? (props.isUp ? 'transform: rotate(-90deg);' : 'transform: rotate(90deg);') : ''}
`;

const Price = styled.span<{ isUp?: boolean }>`
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 100%;
    color: ${(props) =>
        props.isUp !== undefined
            ? props.isUp
                ? props.theme.positionColor.up
                : props.theme.positionColor.down
            : props.theme.textColor.primary};
`;

const getPriceAnimation = (priceLength: number) => {
    let styles = '';
    const startFromPosition = 3;

    for (let i = startFromPosition; i <= priceLength; i++) {
        styles += `
                    &:nth-of-type(${i}) {
                        animation-delay: ${(i - startFromPosition + 1) * 0.1}s;
                    }
                `;
    }

    return css`
        ${styles}
    `;
};

const getPriceNumberStyle = () => {
    let styles = '';

    for (let i = 1; i <= 3; i++) {
        styles += `
                    &:nth-child(${i}) {
                        top: ${i * -100}%;
                    }
                `;
    }

    return css`
        ${styles}
    `;
};

const PriceNumber = styled(Price)<{ priceLength: number }>`
    position: relative;
    display: inline-block;
    transform: translate3d(0, 400%, 0);
    animation: countdown 1s forwards;

    ${(props) => getPriceAnimation(props.priceLength)};

    i {
        position: absolute;
        ${getPriceNumberStyle()}
    }

    @keyframes countdown {
        from {
            transform: translateY(400%);
        }

        to {
            transform: translateY(0);
        }
    }
`;

export default CurrentPrice;
