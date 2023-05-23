import React from 'react';
import ReactModal from 'react-modal';
import styled, { CSSProperties } from 'styled-components';
import { FlexDiv, FlexDivRow } from 'theme/common';
import { convertCssToStyledProperties } from 'utils/style';

type ModalProps = {
    title: string;
    shouldCloseOnOverlayClick?: boolean;
    customStyle?: ReactModal.Styles;
    mobileStyle?: {
        container?: CSSProperties;
        header?: CSSProperties;
    };
    onClose: () => void;
};

ReactModal.setAppElement('#root');

const defaultCustomStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '0px',
        background: 'transparent',
        border: 'none',
        overflow: 'none',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 2,
        backdropFilter: 'blur(10px)',
    },
};

export const Modal: React.FC<ModalProps> = ({
    title,
    onClose,
    children,
    shouldCloseOnOverlayClick,
    customStyle,
    mobileStyle,
}) => {
    const customStylesOverride = customStyle
        ? {
              content: { ...defaultCustomStyles.content, ...customStyle.content },
              overlay: { ...defaultCustomStyles.overlay, ...customStyle.overlay },
          }
        : defaultCustomStyles;

    return (
        <ReactModal
            isOpen
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
            style={customStylesOverride}
        >
            <Container mobileStyle={mobileStyle?.container}>
                <Header mobileStyle={mobileStyle?.header}>
                    <Title>{title}</Title>
                    <FlexDivRow>{<CloseIcon className="icon icon--x-sign" onClick={onClose} />}</FlexDivRow>
                </Header>
                {children}
            </Container>
        </ReactModal>
    );
};

const Container = styled.div<{ mobileStyle?: CSSProperties }>`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    background: ${(props) => props.theme.background.primary};
    padding: 20px;
    border-radius: 8px;
    @media (max-width: 575px) {
        ${(props) => (props.mobileStyle ? convertCssToStyledProperties(props.mobileStyle) : '')}
    }
    max-height: 100vh;
    height: fit-content;
`;

const Header = styled(FlexDivRow)<{ mobileStyle?: CSSProperties }>`
    margin-bottom: 20px;
    @media (max-width: 575px) {
        ${(props) => props.mobileStyle && convertCssToStyledProperties(props.mobileStyle)}
    }
`;

const Title = styled(FlexDiv)`
    font-weight: bold;
    font-size: 18px;
    line-height: 110%;
    color: ${(props) => props.theme.textColor.secondary};
    text-align: center;
`;

const CloseIcon = styled.i`
    font-family: Icons !important;
    font-size: 16px;
    line-height: 16px;
    cursor: pointer;
    color: ${(props) => props.theme.textColor.secondary};
`;

export default Modal;
