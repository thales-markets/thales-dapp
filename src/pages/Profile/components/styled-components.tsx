import { ScreenSizeBreakpoint } from 'constants/ui';
import styled from 'styled-components';

export const NoDataText = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 24px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        font-size: 15px;
    }
`;

export const NoDataContainer = styled.div`
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 50px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        margin-top: 10px;
    }
`;

export const CardWrapper = styled.div<{ background?: boolean }>`
    background: ${(props) => (props.background ? props.theme.background.quaternary : 'transparent')};
    margin-bottom: 15px;
    border-radius: 15px;
    padding: 2px;
    border: ${(props) => (props.background ? 'none' : `2px solid ${props.theme.borderColor.primary}`)};
    &:hover {
        transform: scale(1.02);
        border: ${(props) => (props.background ? 'none' : `2px solid ${props.theme.borderColor.secondary}`)};
    }
`;

export const Card = styled.div`
    background: ${(props) => props.theme.background.primary};
    box-sizing: border-box;
    border-radius: 15px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    @media (max-width: 380px) {
        padding: 16px 10px;
    }
`;
export const CardColumn = styled.div<{ ranged?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 100%;
    flex: ${(props) => (props.ranged ? 'none' : '2')};
`;

export const CardRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    & > svg {
        width: 36px !important;
        height: 36px !important;
    }

    @media (max-width: 500px) {
        & > svg {
            width: 26px !important;
            height: 26px !important;
            margin-bottom: 4px;
        }
    }
`;

export const CardText = styled.span`
    display: block;
    color: ${(props) => props.theme.textColor.primary};
    line-height: 100%;
    white-space: pre;
`;

export const CardSection = styled.div`
    display: block;
    &:not(:last-child) {
        margin-bottom: 10px;
    }
    @media (max-width: 500px) {
        & > svg {
            width: 32px !important;
            height: 32px !important;
            margin-bottom: 4px;
        }
    }
`;

export const CardRowTitle = styled(CardText)`
    font-size: 14px;
    font-weight: 400;
    text-transform: capitalize;
    margin-bottom: 4px;
    @media (max-width: 500px) {
        font-size: 8px;
    }
`;

export const CardRowSubtitle = styled(CardText)`
    font-size: 23px;
    span {
        font-size: 23px !important;
        white-space: pre;
    }
    font-weight: 700;
    @media (max-width: 500px) {
        font-size: 14px;
        span {
            font-size: 14px !important;
        }
    }

    @media (max-width: 400px) {
        font-size: 12px;
        span {
            font-size: 12px !important;
        }
    }
`;