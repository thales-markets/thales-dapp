import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';

export const Container = styled(FlexDivColumn)`
    z-index: 10;
    width: 100%;
`;

export const CenterGame = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
`;

export const GameWrapper = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    justify-content: center;
    aspect-ratio: 16/9;
`;

export const WalletMessage = styled.div`
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: ${(props) => props.theme.warning.textColor.primary};
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
`;

export const FullScreenButton = styled.img`
    position: absolute;
    bottom: 20px;
    right: 20px;
    cursor: pointer;
    height: 9%;
`;
