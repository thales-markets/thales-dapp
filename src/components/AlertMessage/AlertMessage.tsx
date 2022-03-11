import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from 'assets/images/close.svg';
import { FlexDiv, Image } from 'theme/common';
import { useTranslation } from 'react-i18next';
import successIcon from 'assets/images/alerts/success-icon.svg';
import errorIcon from 'assets/images/alerts/error-icon.svg';
import infoIcon from 'assets/images/alerts/info-icon.svg';

export enum AlertMessageTypeEnum {
    SUCCESS = 'success',
    INFO = 'info',
    ERROR = 'error',
}

type AlertMessagePropsType = {
    message: string;
    fontSize?: string;
    hideCloseButton?: boolean;
    isRoyale?: boolean;
    onClose?: () => void;
    showMessage: boolean;
    type: string;
};

const AlertMessage: React.FC<AlertMessagePropsType> = ({
    message,
    type,
    fontSize,
    hideCloseButton,
    isRoyale,
    onClose,
    showMessage,
}) => {
    const { t } = useTranslation();
    const [close, setCloseState] = useState<boolean>(false);

    const onClickEvent = () => {
        if (typeof onClose == 'function') {
            onClose();
        }
        setCloseState(!close);
    };

    const getTitle = (type: string) => {
        switch (type) {
            case AlertMessageTypeEnum.SUCCESS:
                return t('common.alerts.title.success');
            case AlertMessageTypeEnum.INFO:
                return t('common.alerts.title.info');
            case AlertMessageTypeEnum.ERROR:
                return t('common.alerts.title.error');
            default:
                return '';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case AlertMessageTypeEnum.SUCCESS:
                return successIcon;
            case AlertMessageTypeEnum.INFO:
                return infoIcon;
            case AlertMessageTypeEnum.ERROR:
                return errorIcon;
            default:
                return '';
        }
    };

    return (
        <>
            {showMessage && (
                <Wrapper isRoyale={isRoyale} close={close} type={type} fontSize={fontSize}>
                    <AlertMessageIconContainer>
                        <AlertMessageIcon isRoyale={isRoyale} src={getIcon(type)} />
                    </AlertMessageIconContainer>
                    <AlertMessageTextContainer>
                        <AlertMessageTitle isRoyale={isRoyale}>{getTitle(type)}</AlertMessageTitle>
                        <AlertMessageText isRoyale={isRoyale}>{message}</AlertMessageText>
                    </AlertMessageTextContainer>

                    <AlertMessageIconContainer>
                        {!hideCloseButton && <CloseIconContainer isRoyale={isRoyale} onClick={() => onClickEvent()} />}
                    </AlertMessageIconContainer>

                    <BottomColoredDiv isRoyale={isRoyale} type={type} />
                </Wrapper>
            )}
        </>
    );
};

const getBackgroundColor = (type: string) => {
    switch (type) {
        case AlertMessageTypeEnum.SUCCESS:
            return '#B6F7C4';
        case AlertMessageTypeEnum.INFO:
            return '#B3E5F5';
        case AlertMessageTypeEnum.ERROR:
            return '#FEB7B6';
        default:
            return '';
    }
};

const getColor = (type: string) => {
    switch (type) {
        case AlertMessageTypeEnum.SUCCESS:
            return '#04D87F';
        case AlertMessageTypeEnum.INFO:
            return '#0383CB';
        case AlertMessageTypeEnum.ERROR:
            return '#FF4141';
        default:
            return '';
    }
};

const Wrapper = styled.div<{
    close: boolean;
    fontSize?: string;
    showCloseButton?: boolean;
    isRoyale?: boolean;
    type: string;
}>`
    position: relative;
    display: flex;
    border-radius: ${(_props) => (_props?.isRoyale ? '5px' : '15px')};
    border: ${(_props) => (_props?.isRoyale ? '2px solid #EE7C77' : '')};
    width: 100%;
    background-color: ${(_props) => (_props?.type ? getBackgroundColor(_props.type) : 'var(--primary-color)')};
    color: ${(_props) => (_props.type ? '#000000' : 'var(--background)')};
    font-size: ${(_props) => (_props.fontSize ? _props.fontSize : '14px')};
    font-weight: 600;
    margin-top: 10px;
    height: ${(_props) => (_props?.isRoyale ? '50px' : '93px')};
    margin-bottom: 10px;
    padding: 0px 5px;
`;

const BottomColoredDiv = styled.div<{
    type: string;
    isRoyale?: boolean;
}>`
    display: ${(_props) => (_props?.isRoyale ? 'none' : '')};
    height: 8px;
    background-color: ${(_props) => (_props?.type ? getColor(_props.type) : 'var(--primary-color)')};
    border-radius: 0px 0px 12px 12px;
    width: 98.7%;
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin: auto;
`;

const CloseIconContainer = styled(CloseIcon)<{
    isRoyale?: boolean;
}>`
    min-width: ${(_props) => (_props?.isRoyale ? '15px' : '20px')};
    min-height: ${(_props) => (_props?.isRoyale ? '15px' : '20px')};
    display: flex;
    flex: 1 1 100%;
    :hover {
        cursor: pointer;
    }
    filter: invert(0%) sepia(95%) saturate(5%) hue-rotate(110deg) brightness(0%) contrast(100%);
`;

const AlertMessageIcon = styled(Image)<{
    isRoyale?: boolean;
}>`
    width: ${(_props) => (_props?.isRoyale ? '24px' : '44px')};
    height: ${(_props) => (_props?.isRoyale ? '24px' : '44px')};
`;

const AlertMessageTitle = styled.p<{
    isRoyale?: boolean;
}>`
    font-family: ${(_props) => (_props?.isRoyale ? 'Sansation !important' : 'Roboto !important')};
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    font-variant: small-caps;
    display: ${(_props) => (_props?.isRoyale ? 'none' : 'flex')};
`;

const AlertMessageText = styled.p<{
    isRoyale?: boolean;
}>`
    font-family: ${(_props) => (_props?.isRoyale ? 'Sansation !important' : 'Roboto !important')};
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 24px;
    display: flex;
`;

const AlertMessageTextContainer = styled(FlexDiv)`
    flex-direction: column;
    justify-content: center;
    flex: 2 1 18.75em;
`;

const AlertMessageIconContainer = styled(FlexDiv)`
    flex-grow: 1;
    align-items: center;
    justify-content: center;
`;

export default AlertMessage;
