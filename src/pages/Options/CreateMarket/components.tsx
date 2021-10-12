import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core';
import errorIcon from 'assets/images/errorIcon.svg';
import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/core/Slider';
import { ReactComponent as QuestionMarkIcon } from 'assets/images/question-mark.svg';
import { ReactComponent as InfoIcon } from 'assets/images/info-circle.svg';
import { ReactComponent as DollarIcon } from 'assets/images/dollar.svg';
import { ReactComponent as AssetIcon } from 'assets/images/asset.svg';
import { FlexDivCentered, FlexDivColumn, Image, Text } from 'theme/common';
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
            className="tooltip-icon"
        />
    </LightTooltip>
);

export const TooltipInfoIcon: React.FC<TooltipIconProps> = ({ title }) => (
    <LightTooltip title={<span className="text-xxxs dark">{title}</span>} placement="top" arrow={true}>
        <InfoIcon
            style={{ border: '1px solid #04045A', borderRadius: '50%', padding: 1 }}
            width="12"
            height="12"
            className="tooltip-icon"
        />
    </LightTooltip>
);

export const TooltipDollarIcon: React.FC<TooltipIconProps> = ({ title }) => (
    <LightTooltip title={<span className="text-xxxs dark">{title}</span>} placement="top" arrow={true}>
        <DollarIcon
            style={{ border: '1px solid #04045A', borderRadius: '50%', padding: 1 }}
            width="12"
            height="12"
            className="tooltip-icon"
        />
    </LightTooltip>
);

export const TooltipAssetIcon: React.FC<TooltipIconProps> = ({ title }) => (
    <LightTooltip title={<span className="text-xxxs dark">{title}</span>} placement="top" arrow={true}>
        <AssetIcon
            style={{ border: '1px solid #04045A', borderRadius: '50%', padding: 1 }}
            width="12"
            height="12"
            className="tooltip-icon"
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

export const Error = styled(Text)`
    position: absolute;
    bottom: -14px;
    left: 8px;
`;

export const InputsWrapper = styled(FlexDivColumn)`
    padding: 20px;
    border-radius: 12px;
    background: #04045a;
`;

const Wrapper = styled(FlexDivCentered)`
    background: #e9bcbc;
    justify-content: flex-start;
    white-space: pre;
    padding-right: 4px;
    border-radius: 5px;
    position: absolute;
    bottom: -30px;

    &.hide {
        display: none;
    }

    &:after {
        content: '';
        position: absolute;
        top: -12px;
        left: 30px;
        border-width: 6px;
        border-style: solid;
        border-color: transparent transparent #e9bcbc transparent;
    }
`;

export const ErrorMessage: React.FC<{ text: string; show: boolean }> = ({ text, show }) => {
    return (
        <Wrapper className={show ? '' : 'hide'} style={{ background: '#E9BCBC', borderRadius: 5, zIndex: 3 }}>
            <Image style={{ width: 12, height: 12, margin: 6 }} src={errorIcon}></Image>
            <Text className="text-xxxs red lh16 ls25">{text}</Text>
        </Wrapper>
    );
};
