import { DefaultSubmitButton, InputContainer, InputLabel } from 'pages/Options/Market/components';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivRowCentered } from 'theme/common';

export const NetworkLabel = styled(InputLabel)`
    color: #00f9ff;
    padding: 0 0 0 4px;
    white-space: nowrap;
`;

export const ResultContainer = styled(InputContainer)`
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    border-radius: 10px;
    padding: 1px;
`;

export const Result = styled.div`
    background: #04045a;
    border-radius: 10px;
    border: none;
    height: 64px;
    padding: 31px 0 0 22px;
    font-size: 16px;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    outline: none;
    user-select: none;
`;

export const ArrowContainer = styled(FlexDivCentered)`
    margin-bottom: 15px;
    margin-top: -5px;
`;

export const ThalesWalletAmountLabel = styled(InputLabel)`
    right: 0px;
    top: 0px;
    padding: 8px 14px 0 0;
    text-transform: none;
`;

export const MaxButton = styled(DefaultSubmitButton)`
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    border: none;
    border-radius: 5px;
    width: 53px;
    min-height: 17px;
    text-transform: uppercase;
    padding: 1px;
    color: #f6f6fe;
    &:hover:not(:disabled) {
        cursor: pointer;
        background: #00f9ff;
        color: #00f9ff;
    }
    margin-left: 4px;
    pointer-events: auto;
`;

export const MaxInnerButton = styled(FlexDivRowCentered)`
    font-weight: bold;
    font-size: 10px;
    line-height: 15px;
    letter-spacing: 1px;
    text-transform: uppercase;
    background: #0a2e66;
    border-radius: 5px;
    text-align: center;
    padding-left: 12px;
    padding-right: 12px;
`;
