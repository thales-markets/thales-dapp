import styled from 'styled-components';

export const Text = styled.p`
    color: ${(props) => props.color};
    &.xxxs {
        font-size: 9px;
        line-height: 9px;
        letter-spacing: 0.4px;
    }
    &.xxs {
        font-size: 12px;
        line-height: 12px;
        letter-spacing: 0.4px;
    }
    &.xs {
        font-size: 13px;
        line-height: 13px;
        letter-spacing: 0.4px;
    }
    &.ms {
        font-size: 14px;
        line-height: 14px;
        letter-spacing: 0.4px;
    }
    &.s {
        font-size: 16px;
        line-height: 16px;
        letter-spacing: 0.2px;
    }
    &.sm {
        font-size: 18px;
        line-height: 18px;
        letter-spacing: 0.2px;
    }
    &.m {
        font-size: 20px;
        line-height: 20px;
        letter-spacing: 0.2px;
    }
    &.lm {
        font-size: 25px;
        line-height: 25px;
        letter-spacing: 0.25px;
    }
    &.l {
        font-size: 31px;
        line-height: 31px;
        letter-spacing: 0.25px;
    }
    &.xl {
        font-size: 36px;
        line-height: 36px;
    }
    &.xxl {
        font-size: 49px;
        line-height: 49px;
        letter-spacing: -1px;
    }

    &.xxxl {
        font-size: 64px;
        line-height: 64px;
        letter-spacing: -1px;
    }

    &.title {
        font-size: 72px;
        font-size: 72px;
        letter-spacing: -1px;
    }

    &.normal {
        font-weight: normal;
    }

    &.bold {
        font-weight: bold;
    }
`;
