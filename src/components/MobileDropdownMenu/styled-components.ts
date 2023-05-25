import styled from 'styled-components';

export const PositionWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 0;
    z-index: 2;
`;

export const FiltersButton = styled.div<{ visible?: boolean }>`
    display: block;
    visibility: ${(props) => (props?.visible ? 'visible' : 'hidden')};
    padding: 6px 20px;
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    box-sizing: border-box;
    border-radius: 30px;
    background: ${(props) => props.theme.button.background.tertiary};
    cursor: pointer;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 10px;
    text-transform: uppercase;
    color: ${(props) => props.theme.button.textColor.secondary};
    align-self: center;
    margin: 10px;
`;

export const Arrow = styled.i`
    margin-left: 5px;
    font-size: 10px;
    text-transform: none;
    &.icon--double-arrow {
        font-size: 12px;
    }
`;

export const Wrapper = styled.div<{ visible?: boolean }>`
    display: ${(props) => (props.visible ? 'flex' : 'none')};
    flex-direction: column;
    background: ${(props) => props.theme.background.secondary};
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    box-sizing: border-box;
    border-radius: 12px;
    padding: 15px 20px;
    max-width: 240px;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    text-align: center;
    top: -44px;
    z-index: 2;
`;

export const Item = styled.div<{ active: boolean }>`
    text-transform: uppercase;
    cursor: pointer;
    color: ${(props) => (props.active ? props.theme.textColor.quaternary : props.theme.button.textColor.secondary)};
    display: flex;
    flex-direction: row;
    justify-content: center;
    user-select: none;
    @media (max-width: 768px) {
        font-weight: bold;
        font-size: 12px;
        line-height: 162.5%;
    }
`;

export const Title = styled.p`
    font-weight: bold;
    font-size: 12px;
    line-height: 100%;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.secondary};
    margin-bottom: 10px;
`;
