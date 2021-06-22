import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core';
import sUsd from 'assets/images/sUsd.svg';
import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/core/Slider';
import { ReactComponent as QuestionMarkIcon } from 'assets/images/question-mark.svg';
import { FlexDivColumn, Text } from 'theme/common';
import { COLORS } from 'constants/ui';

type TooltipIconProps = {
    title: React.ReactNode;
};

const LightTooltip = withStyles(() => ({
    arrow: {
        color: '#748BC6',
    },
    tooltip: {
        backgroundColor: '#748BC6',
        border: '1px solid #748BC6',
        padding: 10,
    },
}))(Tooltip);

export const TooltipIcon: React.FC<TooltipIconProps> = ({ title }) => (
    <LightTooltip title={<span className="text-xxxs dark">{title}</span>} placement="top" arrow={true}>
        <QuestionMarkIcon
            style={{ border: '1px solid #04045A', borderRadius: '50%', padding: 1 }}
            width="12"
            height="12"
        />
    </LightTooltip>
);

export const StyledSlider = withStyles({
    root: {},
    thumb: {
        width: 14,
        height: 14,
        marginTop: '-2px',
        background: '#FFFFFF',
        boxShadow: '0px 1px 4px rgba(202, 202, 241, 0.5)',
        '&:focus, &:hover': {
            boxShadow: '0px 1px 4px rgba(202, 202, 241, 0.5)',
        },
        '&$disabled': {
            width: 14,
            height: 14,
            marginTop: '-2px',
            marginLeft: '-6px',
            boxShadow: 'none',
            outline: 0,
        },
    },
    track: {
        height: 10,
        borderRadius: 10,
    },
    rail: {
        height: 10,
        borderRadius: 10,
    },
    disabled: {},
})(Slider);

export const LongSlider = withStyles({
    root: {
        color: COLORS.LONG,
        '&$disabled': {
            color: COLORS.LONG,
            opacity: 0.5,
        },
    },
    disabled: {},
})(StyledSlider);

export const ShortSlider = withStyles({
    root: {
        color: COLORS.SHORT,
        '&$disabled': {
            color: COLORS.SHORT,
            opacity: 0.5,
        },
    },
    disabled: {},
})(StyledSlider);

export const BuySlider = withStyles({
    root: {
        color: COLORS.BUY,
        '&$disabled': {
            color: COLORS.BUY,
            opacity: 0.5,
        },
    },
    disabled: {},
})(StyledSlider);

export const SellSlider = withStyles({
    root: {
        color: COLORS.SELL,
        '&$disabled': {
            color: COLORS.SELL,
            opacity: 0.5,
        },
    },
    disabled: {},
})(StyledSlider);

export const ToggleButton = styled.div`
    position: relative;
    width: 45px;
    height: 15px;
    background: darkgray;
    border-radius: 80px;
    cursor: pointer;
    &.selected {
        background: #44e1e2;
        &:after {
            left: calc(100% - 18px);
            background: #04045a;
        }
    }

    &:after {
        position: absolute;
        display: block;
        content: '';
        width: 18px;
        height: 18px;
        background: #f6f6fe;
        border-radius: 40px;
        top: -2px;
        left: 0;
    }
`;

export const Input = styled.input`
    height: 56px;
    font-weight: bold;
    font-size: 18px !important;
    line-height: 32px !important;
    color: #04045a !important;
`;

export const Field = styled.div`
    &.warning {
        color: orange !important;
        position: relative;
    }
    &.error {
        color: #c62937 !important;
        position: relative;
        margin-bottom: 4px;
        .select-override,
        .input-override {
            border: 2px solid #c62937 !important;
            border-radius: 5px !important;
            color: #c62937 !important;
            .react-select__indicator {
                color: #c62937 !important;
            }
        }
        .text-error {
            color: red !important;
        }
        .susd {
            height: 52px;
            bottom: 2px;
            left: 10px;
            &:before {
                left: 2px;
                top: 12px;
            }
        }
    }
`;

export const SUSDSign = styled.div`
    position: absolute;
    width: 85px;
    height: 56px;
    background: #44e1e2;
    border-radius: 5px;
    z-index: 1;
    left: 0px;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.25px;
    color: #04045a;
    padding-left: 36px;
    padding-top: 12px;
    &:before {
        content: url(${sUsd});
        position: absolute;
        z-index: 2;
        top: 14px;
        left: 4px;
    }
`;

export const HowItWorks = styled.a`
    cursor: pointer;
    color: #44e1e2 !important;
    &:hover {
        text-decoration: underline;
    }
`;

export const Error = styled(Text)`
    position: absolute;
    bottom: -14px;
    left: 8px;
`;

export const FundingInput = styled(Input)`
    position: relative;
    padding-left: 100px !important;
`;

export const InputsWrapper = styled(FlexDivColumn)`
    padding: 20px;
    border-radius: 12px;
    background: #04045a;
`;
