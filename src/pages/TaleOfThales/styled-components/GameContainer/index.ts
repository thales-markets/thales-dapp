import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';
import { StyledComponent } from 'styled-components';

type Children = {
    Center: StyledComponent<'div', any>;
    Wrapper: StyledComponent<'div', any>;
    Msg: StyledComponent<'div', any>;
    Btn: StyledComponent<'img', any>;
};

// @ts-ignore
const Container: StyledComponent<'div', any> & Children = styled(FlexDivColumn)`
    z-index: 10;
    width: 100%;
`;

const CenterGame = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
`;

const GameWrapper = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    justify-content: center;
    aspect-ratio: 16/9;
`;

const WalletMessage = styled.div`
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #ffcc00;
    margin-top: 10px;
    text-align: center;
`;

const FullScreenButton = styled.img`
    position: absolute;
    bottom: 20px;
    right: 20px;
    cursor: pointer;
    height: 9%;
`;

Container.Center = CenterGame;
Container.Wrapper = GameWrapper;
Container.Msg = WalletMessage;
Container.Btn = FullScreenButton;

export default Container;
