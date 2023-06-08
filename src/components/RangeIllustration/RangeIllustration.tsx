import React, { useEffect, useRef } from 'react';
import PointerIcon from 'assets/images/ranged-markets/RangedMarkets_point.svg';
import LeftPriceIcon from 'assets/images/ranged-markets/RangedMarkets_A_tiengle.svg';
import RightPriceIcon from 'assets/images/ranged-markets/RangedMarkets_B_triangle.svg';
import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import styled, { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';

type RangeIllustrationProps = {
    priceData: {
        left: number;
        right: number;
        current: number;
    };
    outColor?: string;
    inColor?: string;
    hidePrice?: boolean;
    fontSize?: number;
    maxWidth?: number;
};

const RangeIllustration: React.FC<RangeIllustrationProps> = ({
    priceData,
    outColor,
    inColor,
    hidePrice,
    fontSize = 20,
    maxWidth = 50,
}) => {
    const theme: ThemeInterface = useTheme();
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef !== null) {
            const c: HTMLCanvasElement = containerRef.current as any;

            const ctx = c.getContext('2d');
            ctx?.clearRect(0, 0, c.width, c.height);
            if (ctx) {
                const START_POINT = [19, 60];
                const WIDTH_OF_IN_RANGE = 86;
                const WIDTH_OF_OUT_RANGE = 86;
                const HEIGHT = 7;
                const HALF_WIDTH_OF_POINTER_ICON = 7;

                const { MIN_PRICE, MAX_PRICE } = calculateMinAndMaxPrice(priceData.left, priceData.right);
                const CURRENT_PRICE_POSITION = calculatePositionForGivenPrice(
                    priceData.current,
                    [MIN_PRICE, MAX_PRICE],
                    [0, 2 * WIDTH_OF_OUT_RANGE + WIDTH_OF_IN_RANGE]
                );
                const CURRENT_PRICE_ICON_POSITION = [CURRENT_PRICE_POSITION, START_POINT[1] - 23];

                // Calculate points position

                const START_POINT_OF_IN_RANGE = [START_POINT[0] + WIDTH_OF_OUT_RANGE, START_POINT[1]];
                const START_POINT_OF_SECOND_OUT_RANGE = [
                    START_POINT_OF_IN_RANGE[0] + WIDTH_OF_IN_RANGE,
                    START_POINT_OF_IN_RANGE[1],
                ];

                // First out position
                const firstOutPosition = new Path2D();
                firstOutPosition.moveTo(START_POINT[0], START_POINT[1]);
                firstOutPosition.lineTo(START_POINT[0] + WIDTH_OF_OUT_RANGE, START_POINT[1]);
                firstOutPosition.lineTo(START_POINT[0] + WIDTH_OF_OUT_RANGE, START_POINT[1] + HEIGHT);
                firstOutPosition.lineTo(START_POINT[0], START_POINT[1] + HEIGHT);
                firstOutPosition.closePath();
                ctx.fillStyle = outColor ? outColor : theme.positionColor.out;
                ctx.fill(firstOutPosition);

                // Rectangle inside range
                const inPosition = new Path2D();
                inPosition.moveTo(START_POINT_OF_IN_RANGE[0], START_POINT_OF_IN_RANGE[1]);
                inPosition.lineTo(START_POINT_OF_IN_RANGE[0] + WIDTH_OF_IN_RANGE, START_POINT_OF_IN_RANGE[1]);
                inPosition.lineTo(START_POINT_OF_IN_RANGE[0] + WIDTH_OF_IN_RANGE, START_POINT_OF_IN_RANGE[1] + HEIGHT);
                inPosition.lineTo(START_POINT_OF_IN_RANGE[0], START_POINT_OF_IN_RANGE[1] + HEIGHT);
                inPosition.closePath();
                ctx.fillStyle = inColor ? inColor : theme.positionColor.in;
                ctx.fill(inPosition);

                // Second out position
                const secondOutPosition = new Path2D();
                secondOutPosition.moveTo(START_POINT_OF_SECOND_OUT_RANGE[0], START_POINT_OF_SECOND_OUT_RANGE[1]);
                secondOutPosition.lineTo(
                    START_POINT_OF_SECOND_OUT_RANGE[0] + WIDTH_OF_OUT_RANGE,
                    START_POINT_OF_SECOND_OUT_RANGE[1]
                );
                secondOutPosition.lineTo(
                    START_POINT_OF_SECOND_OUT_RANGE[0] + WIDTH_OF_OUT_RANGE,
                    START_POINT_OF_SECOND_OUT_RANGE[1] + HEIGHT
                );
                secondOutPosition.lineTo(
                    START_POINT_OF_SECOND_OUT_RANGE[0],
                    START_POINT_OF_SECOND_OUT_RANGE[1] + HEIGHT
                );
                secondOutPosition.closePath();
                ctx.fillStyle = outColor ? outColor : theme.positionColor.out;
                ctx.fill(secondOutPosition);

                // Current price pointer svg
                const pointerSVGImage = new Image();
                pointerSVGImage.src = PointerIcon;
                pointerSVGImage.onload = function () {
                    ctx.drawImage(
                        pointerSVGImage,
                        START_POINT[0] + CURRENT_PRICE_POSITION - HALF_WIDTH_OF_POINTER_ICON,
                        CURRENT_PRICE_ICON_POSITION[1]
                    );
                };

                // Left Price Icon
                const leftPriceIcon = new Image();
                leftPriceIcon.src = LeftPriceIcon;
                leftPriceIcon.onload = function () {
                    ctx.drawImage(leftPriceIcon, START_POINT_OF_IN_RANGE[0] - 11, START_POINT_OF_IN_RANGE[1] + HEIGHT);
                };

                // Right Price Icon
                const rightPriceIcon = new Image();
                rightPriceIcon.src = RightPriceIcon;
                rightPriceIcon.onload = function () {
                    ctx.drawImage(
                        rightPriceIcon,
                        START_POINT_OF_SECOND_OUT_RANGE[0] - 11,
                        START_POINT_OF_SECOND_OUT_RANGE[1] + HEIGHT
                    );
                };

                if (hidePrice !== true) {
                    // Left price label
                    ctx.font = 'normal small-caps bold ' + fontSize + 'px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = theme.textColor.quaternary;
                    ctx.fillText(
                        formatCurrencyWithSign(USD_SIGN, priceData.left),
                        START_POINT_OF_IN_RANGE[0],
                        START_POINT_OF_IN_RANGE[1] + 30 + fontSize,
                        maxWidth
                    );

                    // Right price label
                    ctx.font = 'normal small-caps bold' + fontSize + 'px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = theme.textColor.quaternary;
                    ctx.fillText(
                        formatCurrencyWithSign(USD_SIGN, priceData.right),
                        START_POINT_OF_SECOND_OUT_RANGE[0],
                        START_POINT_OF_SECOND_OUT_RANGE[1] + 30 + fontSize,
                        maxWidth
                    );

                    // Current price element
                    ctx.font = 'normal small-caps bold' + fontSize + 'px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = theme.textColor.quaternary;
                    ctx.fillText(
                        formatCurrencyWithSign(USD_SIGN, priceData.current),
                        START_POINT[0] + CURRENT_PRICE_POSITION,
                        CURRENT_PRICE_ICON_POSITION[1] - 10,
                        maxWidth
                    );
                }
            }
        }
    }, [priceData.left, priceData.right, priceData.current, containerRef]);

    return <Container ref={containerRef} />;
};

const Container = styled.canvas`
    width: 100%;
    padding-left: 0;
    padding-right: 0;
    margin-left: auto;
    margin-right: auto;
    display: block;
    max-width: 350px;
`;

const calculateMinAndMaxPrice = (leftPrice: number, rightPrice: number) => {
    const difference = rightPrice - leftPrice;
    return {
        MIN_PRICE: leftPrice - difference,
        MAX_PRICE: rightPrice + difference,
    };
};

const calculatePositionForGivenPrice = (price: number, priceData: [number, number], range: [number, number]) => {
    if (price < priceData[0]) return range[0];
    if (price > priceData[1]) return range[1];
    return ((price - priceData[0]) * (range[1] - range[0])) / (priceData[1] - priceData[0]) + range[0];
};

export default RangeIllustration;
