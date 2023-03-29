import { ReactSelect } from 'components/OldVersion/old-components';
import NumericInput from 'components/NumericInput';
import styled, { StyledComponent } from 'styled-components';
import { FlexDivColumn, XButton } from 'theme/common';

type Children = {
    SectionWrapper: StyledComponent<'div', any, { royaleTheme?: boolean }>;
    CloseButton: StyledComponent<'img', any, { royaleTheme?: boolean }>;
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
    --background: var(--color-primary);
    --icon-color: #f7f7f7;
    --border-color: var(--color-highlight);

    font-weight: bold;
    font-size: 12px;
    line-height: 24px;
    border-radius: ${(props) => (props.royaleTheme ? '5px' : '15px')};
    min-width: 70px;
    background: ${(props) => (props.royaleTheme ? 'var(--color-wrapper)' : 'var(--background)')};
    border: ${(props) => (props.royaleTheme ? '2px solid var(--color)' : '2px solid var(--border-color)')};
    box-shadow: ${(props) => (props.royaleTheme ? '' : '0px 0px 90px 10px var(--border-color)')};
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

const SwapCloseButton = styled(XButton)<{
    royaleTheme?: boolean;
}>`
    position: absolute;
    top: 20px;
    right: 20px;
    filter: ${(props) =>
        props.royaleTheme
            ? 'invert(14%) sepia(42%) saturate(290%) hue-rotate(104deg) brightness(100%) contrast(94%)'
            : 'invert(27%) sepia(100%) saturate(850%) hue-rotate(162deg) brightness(101%) contrast(99%)'};
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
    color: ${(props) => (props.royaleTheme ? 'var(--color) !important' : 'var(--color-white) !important')};
    font-family: ${(props) => (props.royaleTheme ? 'Sansation !important' : 'Titillium Regular !important')};
`;

const SwapSectionWrapper = styled(FlexDivColumn)<{
    royaleTheme?: boolean;
}>`
    background: ${(props) => (props.royaleTheme ? 'var(--color-wrapper)' : 'var(--background)')};
    border: ${(props) => (props.royaleTheme ? '5px solid var(--color)' : '1px solid var(--border-color)')};
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
    color: ${(props) => (props.royaleTheme ? 'var(--color) !important' : 'var(--color-white) !important')};
    font-family: ${(props) => (props.royaleTheme ? 'Sansation !important' : 'Titillium Regular !important')};
    text-overflow: ellipsis;
    width: ${(props) => (props.contentSize && props.screenWidth && props.screenWidth <= 500 ? '90px' : '')};
    overflow: hidden;
`;

const SwapNumericText = styled.p<{ royaleTheme?: boolean }>`
    font-family: ${(props) => (props.royaleTheme ? 'Sansation !important' : 'Titillium Regular !important')};
    font-style: ${(props) => (props.royaleTheme ? '' : 'normal')};
    font-weight: ${(props) => (props.royaleTheme ? '' : '400')};
    font-size: ${(props) => (props.royaleTheme ? '20px' : '25px')};
    text-transform: uppercase;
    color: ${(props) => (props.royaleTheme ? 'var(--color) !important' : 'var(--color-white) !important')};
`;

const SwapMaxButton = styled.button<{ royaleTheme?: boolean }>`
    cursor: pointer;
    background-color: ${(props) => (props.royaleTheme ? 'var(--color)' : 'var(--border-color)')};
    color: ${(props) => (props.royaleTheme ? 'var(--color-wrapper)' : 'var(--background)')};
    border: transparent;
    border-radius: 20px;
    font-family: ${(props) => (props.royaleTheme ? 'Sansation !important' : 'Titillium Regular !important')};
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
        font-family: ${(props) => (props.royaleTheme ? 'Sansation !important' : 'Titillium Regular !important')};
        background: ${(props) =>
            props.royaleTheme ? 'var(--color-wrapper) !important' : 'var(--background) !important'};
        border: ${(props) => (props.royaleTheme ? 'none !important' : 'none !important')};
    }
    .react-select__single-value,
    .react-select__single-value > div {
        padding: 0 !important;
    }
    .react-select__control--is-focused {
        border: none !important;
    }
    .react-select__option {
        font-family: ${(props) => (props.royaleTheme ? 'Sansation !important' : 'Titillium Regular !important')};
        color: ${(props) => (props.royaleTheme ? 'var(--color) !important' : 'var(--border-color) !important')};
        background: ${(props) =>
            props.royaleTheme ? 'var(--color-wrapper) !important' : 'var(--background) !important'};
        border: ${(props) => (props.royaleTheme ? 'none !important' : 'none !important')};
        &:hover {
            background: ${(props) =>
                props.royaleTheme ? 'var(--color) !important' : 'var(--border-color) !important'};
            & > div > div > p {
                color: ${(props) => (props.royaleTheme ? 'var(--color-wrapper) !important' : '')};
            }
        }
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
    background: ${(props) => (props.royaleTheme ? 'var(--color-wrapper)' : 'var(--background)')};
    border: ${(props) => (props.royaleTheme ? '1px solid var(--color-wrapper)' : 'none !important')};
    color: ${(props) => (props.royaleTheme ? 'var(--color)' : '')};
    font-family: ${(props) => (props.royaleTheme ? 'Sansation !important' : 'Titillium Regular !important')};
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
    background: ${(props) => (props.royaleTheme ? 'var(--color-background)' : 'var(--background)')};
    border-radius: ${(props) => (props.royaleTheme ? '5px' : '15px')};
    border: ${(props) => (props.royaleTheme ? '5px solid var(--color)' : '2px solid var(--border-color)')};
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
    background: ${(props) => (props.royaleTheme ? 'var(--color)' : 'var(--border-color)')};
`;

const SwapImageSceleton: StyledComponent<'div', any, { royaleTheme?: boolean }> = styled.div<{ royaleTheme?: boolean }>`
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background: ${(props) => (props.royaleTheme ? 'var(--color)' : 'var(--border-color)')};
    margin-right: 6px;
`;

const SwapConfirmButton: StyledComponent<'button', any, { royaleTheme?: boolean }> = styled.button<{
    royaleTheme?: boolean;
}>`
    cursor: pointer;
    align-items: center;
    cursor: pointer;
    font-family: ${(props) => (props.royaleTheme ? 'Sansation !important' : 'Titillium Regular !important')};
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 22px;
    background: ${(props) => (props.royaleTheme ? 'var(--color)' : 'var(--border-color)')};
    border: ${(props) => (props.royaleTheme ? '1px solid var(--color)' : '1px solid var(--border-color)')};
    box-sizing: border-box;
    box-shadow: ${(props) => (props.royaleTheme ? ' 0px 0px 30px var(--color);' : ' 0px 0px 0px var(--border-color);')};
    border-radius: 20px;
    padding: 6px 15px 6px 20px;
    margin: 15px 20px;
    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

SwapDialog.SectionWrapper = SwapSectionWrapper;
SwapDialog.CloseButton = SwapCloseButton;
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
