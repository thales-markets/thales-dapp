import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import wizardScreenshot from 'assets/images/wizard/thales-wizard.jpg';
import tutorialScreenshot from 'assets/images/wizard/thales-tutorial.jpg';

const WizardVideo: React.FC<{ header: boolean; videoLink: string; videoTitle: string }> = ({
    header,
    videoLink,
    videoTitle,
}) => {
    const [showIframe, setShowIframe] = useState(false);
    const videoScreenshot = header ? tutorialScreenshot : wizardScreenshot;

    return (
        <>
            {header && (
                <VideoHeader>
                    <Trans i18nKey="wizard-page.video-header" />
                </VideoHeader>
            )}
            {!showIframe && (
                <VideoContainer>
                    <VideoTutorial
                        src={videoScreenshot}
                        onClick={() => {
                            setShowIframe(true);
                        }}
                    />
                </VideoContainer>
            )}
            {showIframe && (
                <IFrameWrapper>
                    {
                        <IFrame
                            width="1280"
                            height="720"
                            src={videoLink}
                            title={videoTitle}
                            allow={
                                'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            }
                            allowFullScreen
                        />
                    }
                </IFrameWrapper>
            )}
        </>
    );
};

const VideoHeader = styled.p`
    font-family: 'Titillium Web';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 33px;
    color: var(--color-white);
    margin-top: 30px;
    margin-bottom: 20px;
`;

const VideoContainer = styled.div`
    width: 100%;
`;

const VideoTutorial = styled.img`
    width: 100%;
    cursor: pointer;
`;

const IFrameWrapper = styled.div`
    width: 100%;
    height: 100%;
`;

const IFrame = styled.iframe`
    width: 100%;
    height: 505px;
`;

export default WizardVideo;
