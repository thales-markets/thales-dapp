import Modal from 'components/Modal';
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FlexDiv } from 'styles/common';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import ReactModal from 'react-modal';
import { buildHref } from 'utils/routes';
import ROUTES from 'constants/routes';
import SPAAnchor from 'components/SPAAnchor';

type AllSetModalProps = {
    onClose: () => void;
};

const AllSetModal: React.FC<AllSetModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    return (
        <Modal customStyle={Styles} title={''} onClose={() => onClose()}>
            <Wrapper>
                <Text>{t('deposit.all-set')}</Text>
                <CheckIcon className="icon icon--win" />
                <FooterText>{t('deposit.ready-to-use')}</FooterText>
                <SPAAnchor href={buildHref(ROUTES.Options.Home)}>
                    <Button
                        onClick={() => {}}
                        width="220px"
                        height="34px"
                        backgroundColor={theme.background.quaternary}
                    >
                        {t('deposit.go')}
                    </Button>
                </SPAAnchor>
            </Wrapper>
        </Modal>
    );
};

const Styles: ReactModal.Styles = {
    content: {
        width: '100%',
        height: '100%',
        maxWidth: '720px',
        maxHeight: '467px',
    },
};

const Wrapper = styled(FlexDiv)`
    width: 100%;
    max-width: 720px;
    height: 368px;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
`;

const Text = styled.span`
    font-family: 'Nunito';
    color: ${(props) => props.theme.textColor.primary};
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 28px */
    text-transform: capitalize;
`;

const CheckIcon = styled.i`
    font-size: 120px;
    color: ${(props) => props.theme.textColor.quaternary};
`;

const FooterText = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 100%; /* 14px */
    text-transform: capitalize;
`;

export default AllSetModal;
