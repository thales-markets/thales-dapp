import Collapse from 'components/Collapse';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';

const FAQ: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Wrapper>
            <Collapse title={t('sales-landing.faq.1.title')}>
                <Content>
                    <p>{t('sales-landing.faq.1.content')}</p>
                    <List>
                        <li>
                            <Trans
                                i18nKey={'sales-landing.faq.1.list.1'}
                                components={{
                                    bold: <Bold />,
                                }}
                            />
                        </li>
                        <li>
                            <Trans
                                i18nKey={'sales-landing.faq.1.list.2'}
                                components={{
                                    bold: <Bold />,
                                }}
                            />
                        </li>
                        <li>
                            <Trans
                                i18nKey={'sales-landing.faq.1.list.3'}
                                components={{
                                    bold: <Bold />,
                                }}
                            />
                        </li>
                    </List>
                </Content>
            </Collapse>
            <Collapse title={t('sales-landing.faq.2.title')}>
                <Content>
                    <p>{t('sales-landing.faq.2.content')}</p>
                </Content>
            </Collapse>
            <Collapse title={t('sales-landing.faq.3.title')}>
                <Content>
                    <p>{t('sales-landing.faq.3.content')}</p>
                </Content>
            </Collapse>
            <Collapse title={t('sales-landing.faq.4.title')}>
                <Content>
                    <p>{t('sales-landing.faq.4.content')}</p>
                    <List>
                        <li>
                            <Trans
                                i18nKey={'sales-landing.faq.4.list.1'}
                                components={{
                                    bold: <Bold />,
                                }}
                            />
                        </li>
                        <li>
                            <Trans
                                i18nKey={'sales-landing.faq.4.list.2'}
                                components={{
                                    bold: <Bold />,
                                }}
                            />
                        </li>
                        <li>
                            <Trans
                                i18nKey={'sales-landing.faq.4.list.3'}
                                components={{
                                    bold: <Bold />,
                                }}
                            />
                        </li>
                        <li>
                            <Trans
                                i18nKey={'sales-landing.faq.4.list.4'}
                                components={{
                                    bold: <Bold />,
                                }}
                            />
                        </li>
                    </List>
                </Content>
            </Collapse>
            <Collapse title={t('sales-landing.faq.5.title')}>
                <Content>
                    <p>
                        <Trans
                            i18nKey={'sales-landing.faq.5.content'}
                            components={{
                                br: <br />,
                                bold: <Bold />,
                            }}
                        />
                    </p>
                </Content>
            </Collapse>
            <Collapse title={t('sales-landing.faq.6.title')}>
                <Content>
                    <p>
                        <Trans
                            i18nKey={'sales-landing.faq.6.content'}
                            components={{
                                br: <br />,
                                bold: <Bold />,
                            }}
                        />
                    </p>
                </Content>
            </Collapse>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDiv)`
    width: 100%;
    flex-direction: column;
`;

const Content = styled(FlexDiv)`
    font-size: 21px;
    font-weight: 300 !important;
    font-family: NunitoExtraLight !important;
    flex-direction: column;
    margin: 10px 0px;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    p {
        font-family: NunitoExtraLight !important;
    }
`;

const Bold = styled.span`
    font-weight: 700;
`;

const List = styled.ul`
    margin: 15px 0px;
    font-family: NunitoExtraLight !important;
    font-size: 21px;
    list-style: disc;
    list-style-position: inside;
    font-weight: 300 !important;
    li {
        margin: 10px 0px;
        line-height: 120%;
        font-family: NunitoExtraLight !important;
    }
`;

export default FAQ;
