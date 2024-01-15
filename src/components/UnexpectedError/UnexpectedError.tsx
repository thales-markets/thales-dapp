import Button from 'components/Button';
import { LINKS } from 'constants/links';
import ROUTES from 'constants/routes';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered } from 'styles/common';
import { ThemeInterface } from 'types/ui';
import { isMobile } from 'utils/device';
import { navigateTo } from 'utils/routes';

const DISCORD_HELP_CHANNEL_ID = '906723153349316638';

const UnexpectedError: React.FC<{ theme: ThemeInterface }> = ({ theme }) => {
    const { t } = useTranslation();
    const { resetBoundary } = useErrorBoundary();

    // Discord Widget bot
    const crate = (window as any).crate;
    if (crate) {
        if (isMobile()) {
            // notify user with a message
            crate.notify('Please help us about this issue by writing to Thales/help-and-questions');
            setTimeout(() => {
                // change channel to Help and Questions
                crate.navigate(DISCORD_HELP_CHANNEL_ID);
            }, 7000);
        } else {
            // change channel to Help and Questions
            crate.navigate(DISCORD_HELP_CHANNEL_ID);
        }
    }

    const tryAgainHandler = () => {
        if (crate) {
            // close widget
            crate.toggle(false);
        }
        resetBoundary();
        navigateTo(ROUTES.Options.Home);
    };

    return (
        <Container theme={theme}>
            <FlexDivCentered>
                <Message>{t('common.errors.something-went-wrong')}</Message>
            </FlexDivCentered>
            <FlexDivCentered>
                <Text>
                    <Trans
                        i18nKey="common.support-contact"
                        components={{
                            anchor: <Link href={LINKS.Discord.Help} target="_blank" rel="noreferrer" />,
                        }}
                    />
                </Text>
            </FlexDivCentered>
            <FlexDivCentered>
                <Button
                    onClick={tryAgainHandler}
                    margin="10px 0 0 0"
                    backgroundColor={theme.button.background.primary}
                    borderColor={theme.button.background.primary}
                    textColor={theme.button.textColor.primary}
                >
                    {t('common.try-again')}
                </Button>
            </FlexDivCentered>
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)<{ theme: ThemeInterface }>`
    height: 100%;
    background: ${(props) => props.theme.background.primary};
    color: ${(props) => props.theme.textColor.primary};
    font-family: ${(props) => props.theme.fontFamily.primary};

    a {
        color: ${(props) => props.theme.link.textColor.primary};
    }
    button {
        font-family: ${(props) => props.theme.fontFamily.primary};
    }
`;

const Message = styled.span`
    font-size: 42px;
    padding: 10px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 22px;
    }
`;

const Text = styled.span`
    font-size: 22px;
    padding: 10px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 13px;
    }
`;

const Link = styled.a`
    &:hover {
        text-decoration: underline;
    }
`;

export default UnexpectedError;
