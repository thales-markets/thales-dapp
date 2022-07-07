import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import videoTutorial from 'assets/images/wizard/video-tutorial.png';

const WizardVideo: React.FC = () => {
    const [showIframe, setShowIframe] = useState(false);

    const videoLink = 'https://www.youtube.com/embed/MXqt3itSCgw?&autoplay=1';

    return (
        <>
            <VideoHeader>
                <Trans i18nKey="wizard-page.video-header" />
            </VideoHeader>
            {!showIframe && (
                <VideoContainer>
                    <VideoTutorial
                        src={videoTutorial}
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
                            title="On-boarding Wizard video walk through for Thales platform"
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
    color: #ffffff;
    margin-top: 30px;
    margin-bottom: 20px;
`;

const VideoContainer = styled.div`
    width: 100%;
`;

const VideoTutorial = styled.img`
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
