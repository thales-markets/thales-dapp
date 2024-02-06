import styled from 'styled-components';

export const FlexDiv = styled.div`
    display: flex;
    outline: none !important;
`;

export const FlexDivCentered = styled(FlexDiv)`
    align-items: center;
    justify-content: center;
`;

export const FlexDivSpaceBetween = styled(FlexDiv)<{ margin?: string }>`
    align-items: center;
    justify-content: space-between;
    ${(props) => (props.margin ? `margin: ${props.margin}` : '')}
`;

export const FlexDivEnd = styled(FlexDiv)`
    justify-content: end;
`;

export const FlexDivStart = styled(FlexDiv)`
    justify-content: start;
`;

export const FlexDivRow = styled(FlexDiv)`
    justify-content: space-between;
`;

export const FlexDivRowCentered = styled(FlexDivRow)`
    align-items: center;
`;

export const FlexDivColumn = styled(FlexDiv)`
    flex: 1;
    flex-direction: column;
`;

export const FlexDivColumnCentered = styled(FlexDivColumn)`
    justify-content: center;
`;

export const BoldText = styled.span`
    font-weight: 700;
`;

// TODO: Update color names
export const Colors = {
    GRAY: '#2B3139',
    GRAY_LIGHT: '#848E9C',
    GRAY_DARK: '#181A20',
    GRAY_DARK_ZERO: 'rgb(24, 26, 32, 0)',
    GRAY_PURPLE: 'rgba(48, 54, 86, 1)',
    GRAY_PURPLE_BLURED: 'rgba(48, 54, 86, 0.4)',
    GRAY_BLUE: '#808997',

    WHITE: '#FFFFFF',

    GREEN: '#03DAC5',
    GREEN_LIGHT: '#B0FFE7',
    GREEN_DARK: '#1D976C',
    GREEN_DARK_START: 'rgb(76, 211, 163, 0.5)',
    GREEN_DARK_END: 'rgb(76, 211, 163, 0)',

    BLACK: '#000000',
    BLACK_LIGHT: '#121212',

    BLUE: '#5B86E5',
    BLUE_LIGHT: '#36D1DC',
    BLUE_DARK: '#1043B4',
    BLUE_MIDNIGHT: '#052040',
    BLUE_MIDNIGHT_LIGHT: '#1b314f',
    BLUE_SKY: '#91bced',

    RED: '#DE496D',
    RED_LIGHT: '#E29587',
    RED_DARK: '#D66D75',

    ORANGE: '#F7B91A',
    ORANGE_LIGHT: '#FFB866',
    ORANGE_DARK: '#FF8800',

    YELLOW: '#FFCC00',
    YELLOW_DARK: '#9b8327',

    PURPLE: '#BF7EFF',
};
