import styled from 'styled-components';
import localStore from 'utils/localStore';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { Theme } from 'constants/ui';

export const FlexDiv = styled.div`
    display: flex;
    outline: none !important;
`;

export const FlexDivCentered = styled(FlexDiv)`
    align-items: center;
    justify-content: center;
`;

export const FlexDivSpaceBetween = styled(FlexDiv)`
    align-items: center;
    justify-content: space-between;
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

export const GridDiv = styled.div`
    display: grid;
`;

export const GridDivCentered = styled(GridDiv)`
    align-items: center;
`;

export const GridDivRow = styled(GridDiv)`
    grid-auto-flow: row;
`;

export const GridDivCenteredRow = styled(GridDivCentered)`
    grid-auto-flow: row;
`;

export const GridDivCol = styled(GridDiv)`
    grid-auto-flow: column;
`;

export const GridDivCenteredCol = styled(GridDivCentered)`
    grid-auto-flow: column;
`;

export const LoaderContainer = styled(GridDivCenteredRow)`
    grid-gap: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export const UserCardSectionHeader = styled.span`
    font-weight: bold;
    font-size: 15px;
    line-height: 20px;
    color: var(--color-highlight);
    text-transform: uppercase;
`;

export const CardContainer = styled.div`
    border: 2px solid var(--card-border-color);
    border-radius: 15px;
`;

export const InputContainer = styled.div`
    border: 0.8px solid var(--card-border-color);
    border-radius: 10px;
`;

export const NoDataText = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 24px;
    @media (max-width: 768px) {
        font-size: 15px;
    }
`;

export const NoDataContainer = styled.div`
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 50px;
    @media (max-width: 768px) {
        margin-top: 10px;
    }
`;

export const getDefaultTheme = (): Theme => {
    const lsTheme = localStore.get(LOCAL_STORAGE_KEYS.UI_THEME);
    return lsTheme !== undefined
        ? Object.values(Theme).includes(lsTheme as number)
            ? (lsTheme as Theme)
            : Theme.DARK
        : Theme.DARK;
};

// TODO: Update color names
export const Colors = {
    GRAY: '#2B3139',
    GRAY_LIGHT: '#848E9C',
    GRAY_DARK: '#181A20',
    GRAY_PURPLE: '#303656',

    WHITE: '#FFFFFF',

    GREEN: '#03DAC5',
    GREEN_LIGHT: '#93F9B9',
    GREEN_DARK: '#1D976C',

    BLACK: '#000000',
    BLACK_LIGHT: '#121212',

    BLUE: '#5B86E5',
    BLUE_LIGHT: '#36D1DC',
    BLUE_DARK: '#1043B4',
    BLUE_MIDNIGHT: '#050838',

    RED: '#DE496D',
    RED_LIGHT: '#E29587',
    RED_DARK: '#D66D75',

    ORANGE: '#F7B91A',
    ORANGE_DARK: '#FF8800',

    YELLOW: '#FFCC00',
};
