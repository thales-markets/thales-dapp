import NumericInput from 'components/NumericInput';
import { ReactSelect } from 'pages/CreateMarket/styled-components';
import styled, { StyledComponent } from 'styled-components';
import { FlexDivColumn } from 'theme/common';

type Children = {
    SectionWrapper: StyledComponent<'div', any>;
    ErrorMessage: StyledComponent<'p', any>;
    Text: StyledComponent<'p', any, { contentSize?: string; screenWidth?: number }>;
    NumericText: StyledComponent<'p', any>;
    MaxButton: StyledComponent<'button', any>;
    TokenSelect: any;
    TokenLogo: StyledComponent<'img', any>;
    NumInput: any;
};

// @ts-ignore
const SwapDialog: StyledComponent<'div', any, { contentType?: string }> & Children = styled.div<{
    contentType?: string;
}>`
    font-weight: bold;
    font-size: 12px;
    line-height: 24px;
    min-width: 70px;
    background: ${(props) => props.theme.background.primary};
    margin: auto;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 400px;
    height: fit-content;
    opacity: ${(props) => (props.contentType && props.contentType === 'loading' ? '0.85' : '')};
    @media screen and (max-width: 500px) {
        width: 325px;
    }
`;

const SwapErrorMessage = styled.p`
    font-size: 18px;
    height: 60px;
    display: flex;
    align-self: center;
    align-items: center;
    font-weight: bold;
    color: ${(props) => props.theme.textColor.primary};
`;

const SwapSectionWrapper = styled(FlexDivColumn)`
    background: ${(props) => props.theme.background.primary};
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    padding: 16px;
    padding-bottom: 0;
    border-radius: 15px;
    max-height: fit-content;
    position: relative;
    margin-bottom: 20px;
    &:nth-of-type(1) {
        .react-select__indicators {
            display: none !important;
        }
    }
    &.hide {
        display: none;
    }
`;

const SwapText = styled.p<{ contentSize?: string; screenWidth?: number }>`
    font-size: ${(props) => (props.contentSize === 'large' ? '15px' : '12px')};
    text-transform: ${(props) => (props.contentSize === 'large' ? 'uppercase' : '')};
    font-weight: ${(props) => (props.contentSize === 'large' ? '300' : '600')};
    line-height: ${(props) => (props.contentSize === 'large' ? '91.6%' : '12px')};
    color: ${(props) => props.theme.textColor.primary};
    text-overflow: ellipsis;
    width: ${(props) => (props.contentSize && props.screenWidth && props.screenWidth <= 500 ? '90px' : '')};
    overflow: hidden;
`;

const SwapNumericText = styled.p`
    font-weight: 400;
    font-size: 25px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
`;

const SwapMaxButton = styled.button`
    cursor: pointer;
    background-color: ${(props) => props.theme.button.background.primary};
    color: ${(props) => props.theme.button.textColor.primary};
    border: transparent;
    border-radius: 20px;
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 0.4px;
    font-weight: bold;
    text-transform: uppercase;
`;

const SwapSelect = styled(ReactSelect)`
    flex: 1;
    max-width: 200px;
    margin-left: -10px;
    > div:first-of-type {
        > div:first-of-type div {
            padding: 0px;
        }
    }
    & > div {
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

const SwapNumericInput = styled(NumericInput)<{ screenWidth: number }>`
    padding: 10px 0px;
    width: ${(props) => (props.screenWidth <= 500 ? '100px' : '150px')};
    text-align: right;
    font-size: 25px;
    font-style: normal;
    font-weight: 400;
    line-height: 91.6%;
    background: ${(props) => props.theme.background.primary};
    border: ${(props) => props.theme.input.borderColor.primary};
    color: ${(props) => props.theme.input.textColor.primary};
    &:focus {
        border: none !important;
    }
`;

SwapDialog.SectionWrapper = SwapSectionWrapper;
SwapDialog.ErrorMessage = SwapErrorMessage;
SwapDialog.Text = SwapText;
SwapDialog.NumericText = SwapNumericText;
SwapDialog.MaxButton = SwapMaxButton;
SwapDialog.TokenSelect = SwapSelect;
SwapDialog.TokenLogo = SwapTokenLogo;
SwapDialog.NumInput = SwapNumericInput;

export default SwapDialog;
