import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from 'assets/images/close-red.svg';

type AlertMessagePropsType = {
    children?: any;
    background?: string;
    color?: string;
    fontSize?: string;
    hideCloseButon?: boolean;
    onClose?: () => void;
};

const AlertMessage: React.FC<AlertMessagePropsType> = ({
    children,
    background,
    color,
    fontSize,
    hideCloseButon,
    onClose,
}) => {
    const [close, setCloseState] = useState<boolean>(false);

    const onClickEvent = () => {
        if (typeof onClose == 'function') {
            onClose();
        }
        setCloseState(!close);
    };

    return (
        <Wrapper close={close} background={background} color={color} fontSize={fontSize}>
            {!hideCloseButon && <CloseIconContainer onClick={() => onClickEvent()} />}
            {children ? children : ''}
        </Wrapper>
    );
};

const Wrapper = styled.div<{
    close: boolean;
    background?: string;
    color?: string;
    fontSize?: string;
    showCloseButton?: boolean;
}>`
    position: relative;
    border-radius: 20px;
    ${(_props) => (_props.close ? 'display: none' : '')};
    padding: 5px;
    width: 100%;
    background-color: ${(_props) => (_props?.background ? _props?.background : 'var(--color-white)')};
    color: ${(_props) => (_props.color ? _props.color : 'var(--background)')};
    font-size: ${(_props) => (_props.fontSize ? _props.fontSize : '14px')};
    font-weight: 600;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const CloseIconContainer = styled(CloseIcon)`
    min-width: 10px;
    min-height: 10px;
    top: 4px;
    right: 10px;
    position: absolute;
    :hover {
        cursor: pointer;
    }
    fill: var(--table-border-color) !important;
    & > svg {
        fill: var(--table-border-color) !important;
    }
`;

export default AlertMessage;
