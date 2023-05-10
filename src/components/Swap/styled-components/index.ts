import { ReactSelect } from 'components/OldVersion/old-components';
import NumericInput from 'components/NumericInput';
import styled, { StyledComponent } from 'styled-components';
import { FlexDivColumn } from 'theme/common';

type Children = {
    SectionWrapper: StyledComponent<'div', any, { royaleTheme?: boolean }>;
    CloseIcon: StyledComponent<'i', any, { royaleTheme?: boolean }>;
    ErrorMessage: StyledComponent<
        'p',
        any,
        {
            royaleTheme?: boolean;
        }
    >;
    Text: StyledComponent<'p', any, { royaleTheme?: boolean; contentSize?: string; screenWidth?: number }>;
    NumericText: StyledComponent<'p', any, { royaleTheme?: boolean }>;
    MaxButton: StyledComponent<'button', any, { royaleTheme?: boolean }>;
    TokenSelect: any;
    TokenLogo: StyledComponent<'img', any>;
    NumInput: any;
    SceletonWrapper: StyledComponent<'div', any, { royaleTheme?: boolean }>;
    TextSceleton: StyledComponent<'div', any, { royaleTheme?: boolean; contentType?: string }>;
    ImageSceleton: StyledComponent<'div', any, { royaleTheme?: boolean }>;
    ConfirmButton: StyledComponent<'button', any, { royaleTheme?: boolean }>;
};

// @ts-ignore
const SwapDialog: StyledComponent<'div', any, { royaleTheme?: boolean; contentType?: string }> & Children = styled.div<{
    royaleTheme?: boolean;
    contentType?: string;
}>`
    font-weight: bold;
    font-size: 12px;
    line-height: 24px;
    border-radius: ${(props) => (props.royaleTheme ? '5px' : '15px')};
    min-width: 70px;
    background: ${(props) => props.theme.background.primary};
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    margin: auto;
    position: relative;
    top: 200px;
    padding: 1px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 422px;
    height: fit-content;
    opacity: ${(props) => (props.contentType && props.contentType === 'loading' ? '0.85' : '')};
    @media screen and (max-width: 500px) {
        top: 50px;
        width: 342px;
    }
`;

const SwapCloseIcon = styled.i<{
    royaleTheme?: boolean;
}>`
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 16px;
    line-height: 16px;
    cursor: pointer;
    color: ${(props) => (props.royaleTheme ? '#a3f3d7' : props.theme.textColor.secondary)};
`;

const SwapErrorMessage = styled.p<{
    royaleTheme?: boolean;
}>`
    font-size: 18px;
    height: 60px;
    display: flex;
    align-self: center;
    align-items: center;
    font-weight: bold;
    color: ${(props) => props.theme.textColor.primary};
    font-family: ${(props) => props.theme.fontFamily.primary};
`;

const SwapSectionWrapper = styled(FlexDivColumn)<{
    royaleTheme?: boolean;
}>`
    background: ${(props) => props.theme.background.primary};
    border: ${(props) =>
        props.royaleTheme
            ? `5px solid ${props.theme.borderColor.primary}`
            : `1px solid ${props.theme.borderColor.primary}`};
    padding: 16px;
    padding-bottom: 0;
    border-radius: ${(props) => (props.royaleTheme ? '5px' : '15px')};
    max-height: fit-content;
    position: relative;
    &:first-of-type {
        margin: 60px 20px 20px;
    }
    &:nth-of-type(1) {
        .react-select__indicators {
            display: none !important;
        }
    }
    &:nth-of-type(3) {
        margin: 20px;
    }
    &.hide {
        display: none;
    }
`;

const SwapText = styled.p<{ royaleTheme?: boolean; contentSize?: string; screenWidth?: number }>`
    font-size: ${(props) => (!props.royaleTheme ? (props.contentSize === 'large' ? '15px' : '12px') : '12px')};
    text-transform: ${(props) => (!props.royaleTheme ? (props.contentSize === 'large' ? 'uppercase' : '') : '')};
    font-weight: ${(props) => (!props.royaleTheme ? (props.contentSize === 'large' ? '300' : '600') : '')};
    line-height: ${(props) => (!props.royaleTheme ? (props.contentSize === 'large' ? '91.6%' : '12px') : '12px')};
    color: ${(props) => props.theme.textColor.primary};
    font-family: ${(props) => props.theme.fontFamily.primary};
    text-overflow: ellipsis;
    width: ${(props) => (props.contentSize && props.screenWidth && props.screenWidth <= 500 ? '90px' : '')};
    overflow: hidden;
`;

const SwapNumericText = styled.p<{ royaleTheme?: boolean }>`
    font-family: ${(props) => props.theme.fontFamily.primary};
    font-style: ${(props) => (props.royaleTheme ? '' : 'normal')};
    font-weight: ${(props) => (props.royaleTheme ? '' : '400')};
    font-size: ${(props) => (props.royaleTheme ? '20px' : '25px')};
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
`;

const SwapMaxButton = styled.button<{ royaleTheme?: boolean }>`
    cursor: pointer;
    background-color: ${(props) => props.theme.button.background.primary};
    color: ${(props) => props.theme.button.textColor.primary};
    border: transparent;
    border-radius: 20px;
    font-family: ${(props) => props.theme.fontFamily.primary};
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 0.4px;
    font-weight: bold;
    opacity: 0.5;
`;

const SwapSelect = styled(ReactSelect)<{ royaleTheme?: boolean }>`
    flex: 1;
    max-width: 200px;
    margin-left: -10px;
    margin-bottom: ${(props) => (props.royaleTheme ? '4px' : '')};
    > div:first-of-type {
        > div:first-of-type div {
            padding: 0px;
        }
    }
    & > div {
        font-family: ${(props) => props.theme.fontFamily.primary};
        background: ${(props) => props.theme.background.primary} !important;
        border: none !important;
    }
    .react-select__single-value,
    .react-select__single-value > div {
        padding: 0 !important;
    }
    .react-select__control--is-focused {
        border: none !important;
    }
    .react-select__option {
        font-family: ${(props) => props.theme.fontFamily.primary};
        color: ${(props) => props.theme.textColor.primary};
        background: ${(props) => props.theme.background.secondary};
        border: none !important;
        &:hover {
            background: ${(props) => props.theme.background.primary};
            & > div > div > p {
                color: ${(props) => props.theme.textColor.primary};
            }
        }
    }
    .react-select__menu {
        background: ${(props) => props.theme.background.secondary} !important;
    }
`;

const SwapTokenLogo = styled.img`
    width: 32px;
    height: 32px;
    margin-right: 6px;
`;

const SwapNumericInput = styled(NumericInput)<{ royaleTheme?: boolean; screenWidth: number }>`
    padding: 10px 0px;
    width: ${(props) => (props.screenWidth <= 500 ? '100px' : '150px')};
    text-align: right;
    font-size: ${(props) => (props.royaleTheme ? '20px' : '25px')};
    font-style: normal;
    font-weight: ${(props) => (props.royaleTheme ? '' : '400')};
    line-height: ${(props) => (props.royaleTheme ? '' : '91.6%')};
    background: ${(props) => props.theme.background.primary};
    border: ${(props) => props.theme.input.borderColor.primary};
    color: ${(props) => props.theme.input.textColor.primary};
    font-family: ${(props) => props.theme.fontFamily.primary};
    margin-bottom: ${(props) => (props.royaleTheme ? '4px' : '')};
    &:focus {
        border: none !important;
    }
`;

const SwapSceletonWrapper: StyledComponent<'div', any, { royaleTheme?: boolean }> = styled.div<{
    royaleTheme?: boolean;
}>`
    display: none;
    & > div:nth-child(2) {
        height: 64px;
    }
    max-height: ${(props) => (props.royaleTheme ? '106px' : '94px')};
    background: ${(props) => props.theme.background.primary};
    border-radius: ${(props) => (props.royaleTheme ? '5px' : '15px')};
    border: ${(props) =>
        props.royaleTheme
            ? `5px solid ${props.theme.borderColor.primary}`
            : `2px solid ${props.theme.borderColor.primary}`};
    padding: 16px;
    margin: 20px 20px 20px;
    &.visible {
        display: block;
    }
    @keyframes shimmer {
        100% {
            -webkit-mask-position: left;
        }
    }
    -webkit-mask: linear-gradient(-60deg, #000 30%, #0005, #000 70%) right/300% 100%;
    background-repeat: no-repeat;
    animation: shimmer 2.5s infinite;
`;

const SwapTextSceleton: StyledComponent<'div', any, { royaleTheme?: boolean; contentType?: string }> = styled.div<{
    royaleTheme?: boolean;
    contentType?: string;
}>`
    height: 13px;
    border-radius: 12px;
    width: ${(props) =>
        props.contentType
            ? props.contentType === 'small'
                ? '40px'
                : props.contentType === 'medium'
                ? '80px'
                : '120px'
            : ''};
    background: ${(props) => props.theme.background.primary};
`;

const SwapImageSceleton: StyledComponent<'div', any, { royaleTheme?: boolean }> = styled.div<{ royaleTheme?: boolean }>`
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background: ${(props) => props.theme.background.primary};
    margin-right: 6px;
`;

const SwapConfirmButton: StyledComponent<'button', any, { royaleTheme?: boolean }> = styled.button<{
    royaleTheme?: boolean;
}>`
    cursor: pointer;
    align-items: center;
    cursor: pointer;
    font-family: ${(props) => props.theme.fontFamily.primary};
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 22px;
    background: ${(props) => props.theme.button.background.primary};
    border: 1px solid ${(props) => props.theme.button.borderColor.primary};
    color: ${(props) => props.theme.button.textColor.primary};
    box-sizing: border-box;
    border-radius: 20px;
    padding: 6px 15px 6px 20px;
    margin: 15px 20px;
    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

SwapDialog.SectionWrapper = SwapSectionWrapper;
SwapDialog.CloseIcon = SwapCloseIcon;
SwapDialog.ErrorMessage = SwapErrorMessage;
SwapDialog.Text = SwapText;
SwapDialog.NumericText = SwapNumericText;
SwapDialog.MaxButton = SwapMaxButton;
SwapDialog.TokenSelect = SwapSelect;
SwapDialog.TokenLogo = SwapTokenLogo;
SwapDialog.NumInput = SwapNumericInput;
SwapDialog.SceletonWrapper = SwapSceletonWrapper;
SwapDialog.TextSceleton = SwapTextSceleton;
SwapDialog.ImageSceleton = SwapImageSceleton;
SwapDialog.ConfirmButton = SwapConfirmButton;

export default SwapDialog;
