import Modal from 'components/Modal';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';
import { BoldedText, HighlightText, HighlightTextSecondary } from './styled-components';

const StakingStepsMobile: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useTranslation();

    return (
        <Modal
            title={''}
            onClose={onClose}
            shouldCloseOnOverlayClick={false}
            customStyle={{
                overlay: { zIndex: 2000 },
                content: { width: '100%', height: '100vh' },
            }}
            mobileStyle={{
                container: {
                    height: '100vh',
                    paddingTop: '40px',
                    overflow: 'scroll',
                },
            }}
        >
            <Wrapper>
                <Title>{t('thales-token.gamified-staking.rewards.section-title-staking')}</Title>
                <Divider />
                <Text>
                    <Trans
                        i18nKey="thales-token.gamified-staking.rewards.section-description"
                        components={{
                            bold: <BoldedText />,
                            highlight: <HighlightText />,
                        }}
                    />
                    <br />
                    <br />
                    <Trans i18nKey="thales-token.gamified-staking.rewards.section-base-rewards" />
                    <br />
                    <br />
                    <Trans
                        i18nKey="thales-token.gamified-staking.rewards.section-bonus-rewards"
                        components={{
                            bold: <BoldedText />,
                            highlight: <HighlightText />,
                        }}
                    />
                </Text>
                <Title>{t('thales-token.gamified-staking.rewards.titles.gamified-staking')}</Title>
                <Divider />
                <SubTitle>1 - {t('thales-token.gamified-staking.rewards.card.title-1')}</SubTitle>
                <Text>
                    <Trans
                        i18nKey="thales-token.gamified-staking.rewards.card.content-1"
                        components={{
                            bold: <BoldedText />,
                            highlight: <HighlightTextSecondary />,
                        }}
                    />
                </Text>
                <SubTitle>2 - {t('thales-token.gamified-staking.rewards.card.title-2')}</SubTitle>
                <Text>
                    <Trans
                        i18nKey="thales-token.gamified-staking.rewards.card.content-2"
                        components={{
                            bold: <BoldedText />,
                            highlight: <HighlightTextSecondary />,
                        }}
                    />
                </Text>
                <SubTitle>3 - {t('thales-token.gamified-staking.rewards.card.title-3')}</SubTitle>
                <Text>
                    <Trans
                        i18nKey="thales-token.gamified-staking.rewards.card.content-3"
                        components={{
                            bold: <BoldedText />,
                            highlight: <HighlightTextSecondary />,
                        }}
                    />
                </Text>
                <SubTitle>4 - {t('thales-token.gamified-staking.rewards.card.title-4')}</SubTitle>
                <Text>
                    <Trans
                        i18nKey="thales-token.gamified-staking.rewards.card.content-4"
                        components={{
                            bold: <BoldedText />,
                            highlight: <HighlightTextSecondary />,
                            br: <br />,
                        }}
                    />
                </Text>
            </Wrapper>
        </Modal>
    );
};

const Wrapper = styled(FlexDiv)`
    flex-direction: column;
`;

const Title = styled.h2`
    font-size: 18px;
    font-weight: 600;
    color: ${(_props) => _props.theme.textColor.primary};
`;

const SubTitle = styled.h3`
    font-size: 13px;
    font-weight: 700;
    text-transform: capitalize;
    color: ${(_props) => _props.theme.textColor.primary};
    margin-bottom: 10px;
`;

const Text = styled.p`
    font-weight: 400;
    font-size: 13px;
    line-height: 110%;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 30px;
`;

const Divider = styled.hr`
    width: 100%;
    border-top: 1px solid ${(_props) => _props.theme.borderColor.quaternary};
`;

export default StakingStepsMobile;
