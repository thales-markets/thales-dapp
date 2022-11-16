import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    font-family: Roboto !important;
    font-size: 10px;
`;

export const Icon = styled.i<{ color?: string; fontSize?: string; margin?: string; top?: string }>`
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '20px')};
    color: ${(_props) => (_props?.color ? _props.color : 'var(--primary-color)')};
    margin: ${(_props) => (_props?.margin ? _props.margin : '')};
    top: ${(_props) => (_props?.top ? _props.top : '')};
    position: relative;
`;

export const Text = styled.span<{ margin?: string }>`
    line-height: 110%;
    font-size: 12px;
    color: var(--primary-color);
    margin: ${(_props) => (_props?.margin ? _props.margin : '')};
`;

export const IconContainer = styled.div<{ alignItems?: string; width?: string; display?: string; position?: string }>`
    display: flex;
    align-items: ${(_props) => (_props?.alignItems ? _props.alignItems : 'flex-start')};
    margin: 0px 5px;
    width: ${(_props) => (_props?.width ? _props.width : '')};
    display: ${(_props) => (_props?.display ? _props.display : 'flex')};
    position: ${(_props) => (_props?.position ? _props.position : '')};
`;

export const LinkInTooltip = styled.a`
    color: var(--primary-color);
`;
