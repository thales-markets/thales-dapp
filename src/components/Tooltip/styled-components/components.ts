import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    font-family: Roboto !important;
    font-size: 10px;
`;

export const Icon = styled.i<{ color?: string; fontSize?: string; margin?: string }>`
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '20px')};
    color: ${(_props) => (_props?.color ? _props.color : 'var(--primary-color)')};
    margin: ${(_props) => (_props?.margin ? _props.margin : '')};
`;

export const Text = styled.span<{ margin?: string }>`
    line-height: 110%;
    color: var(--primary-color);
    margin: ${(_props) => (_props?.margin ? _props.margin : '')};
`;

export const IconContainer = styled.div`
    display: flex;
    align-items: flex-start;
    margin: 0px 5px;
`;
