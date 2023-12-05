import { ScreenSizeBreakpoint } from 'enums/ui';
import { CSSProperties } from 'react';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivRow } from 'styles/common';

export const Container = styled.div`
    width: 100%;
`;

export const Header = styled(FlexDivRow)`
    font-size: 18px;
    line-height: 100%;
    width: 100%;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

export const LinkContainer = styled.span`
    :hover {
        text-decoration: underline;
    }
`;

export const NavigationIcon = styled.i<{ isLeft: boolean }>`
    font-weight: 400;
    font-size: 20px;
    ${(props) => (props.isLeft ? 'margin-right: 6px;' : 'margin-left: 6px;')}
    top: -1px;
    position: relative;
`;

export const getDefaultButtonProps = (isMobile: boolean) => ({
    height: isMobile ? '24px' : '27px',
    fontSize: isMobile ? '12px' : '13px',
    padding: '0px 5px',
});

export const getAdditionalButtonStyle = (isMobile: boolean): CSSProperties => ({
    minWidth: isMobile ? '120px' : '180px',
    lineHeight: '100%',
    border: 'none',
    marginRight: '10px',
});

export const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    padding-bottom: 20px;
`;

export const Row = styled(FlexDivRow)`
    align-items: center;
    margin-bottom: 10px;
    :not(:first-child) {
        margin-top: 40px;
    }
`;

export const PositionsWrapper = styled.div<{ hasPositions: boolean; isChained?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 6px;
    ${(props) => (props.hasPositions ? 'overflow-y: auto;' : '')}
    max-height: ${(props) => (props.isChained ? '624' : '560')}px;

    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: row;
        overflow: auto;
    }
`;

export const Title = styled.span`
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    margin-left: 20px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.secondary};
`;

export const LoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 200px;
    width: 100%;
`;

export const NoPositionsText = styled.span`
    text-align: center;
    font-weight: 600;
    font-size: 15px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.secondary};
    min-width: max-content;
    overflow: hidden;
`;
