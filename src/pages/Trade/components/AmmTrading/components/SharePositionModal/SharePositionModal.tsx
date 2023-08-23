import {
    getSuccessToastOptions,
    getErrorToastOptions,
    toastBasicProperties,
} from 'components/ToastMessage/ToastMessage';
import { LINKS } from 'constants/links';
import { toPng } from 'html-to-image';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsMobile } from 'redux/modules/ui';
import { isMetamask, isFirefox, isIos } from 'utils/device';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { Positions } from 'enums/options';
import PotentialWinCard from './components/PotentialWinCard/PotentialWinCard';
import ResolvedWinCard from './components/ResolvedWinCard/ResolvedWinCard';
import SpeedMarketPotentialWinCard from './components/SpeedMarketPotentialWinCard/SpeedMarketPotentialWinCard';
import SpeedMarketResolvedWinCard from './components/SpeedMarketResolvedWinCard/SpeedMarketResolvedWinCard';

type SharePositionType = 'potential' | 'resolved' | 'resolved-speed' | 'potential-speed';

export type SharePositionData = {
    type: SharePositionType;
    position: Positions;
    currencyKey: string;
    strikePrice?: number | string;
    leftPrice?: number;
    rightPrice?: number;
    strikeDate: number;
    marketDuration?: number;
    buyIn: number;
    payout: number;
};

export type SharePositionModalProps = SharePositionData & {
    onClose: () => void;
};

const PARLAY_IMAGE_NAME = 'ParlayImage.png';
const TWITTER_MESSAGE_PASTE = '%0A<PASTE YOUR IMAGE>';
const TWITTER_MESSAGE_UPLOAD = `%0A<UPLOAD YOUR ${PARLAY_IMAGE_NAME}>`;
const TWITTER_MESSAGE_CHECKOUT = `CHECKOUT MY POSITION ON %0A`;

const SharePositionModal: React.FC<SharePositionModalProps> = ({
    type,
    position,
    currencyKey,
    strikePrice,
    leftPrice,
    rightPrice,
    strikeDate,
    buyIn,
    payout,
    onClose,
}) => {
    const isMobile = useSelector((state: RootState) => getIsMobile(state));
    const { trackEvent } = useMatomo();
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);
    const [toastId, setToastId] = useState<string | number>(0);
    const [isMetamaskBrowser, setIsMetamaskBrowser] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    const customStyles = {
        content: {
            top: isMobile ? '41%' : '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '0px',
            background: 'transparent',
            border: 'none',
            borderRadius: '20px',
            overflow: 'visibile',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            zIndex: '1501', // .MuiTooltip-popper has 1500 and validation message pops up from background
        },
    };

    useEffect(() => {
        const checkMetamaskBrowser = async () => {
            const isMMBrowser = (await isMetamask()) && isMobile;
            setIsMetamaskBrowser(isMMBrowser);
        };
        checkMetamaskBrowser().catch((e) => console.log(e));
    }, [isMobile]);

    // Download image mobile: clipboard.write is not supported by all browsers
    // Download image desktop: clipboard.write not supported/enabled in Firefox
    const useDownloadImage = isMobile || isFirefox();

    const saveImageAndOpenTwitter = useCallback(
        async (toastIdParam: string | number) => {
            if (!isLoading) {
                if (ref.current === null) {
                    return;
                }

                const IOS_DOWNLOAD_DELAY = 10 * 1000; // 10 seconds
                try {
                    // In order to improve image quality enlarge image by 2.
                    // Twitter is trying to fit into 504 x 510 with the same aspect ratio, so when image is smaller than 504 x 510, there is quality loss.
                    const aspectRatio = 2;
                    const canvasWidth = ref.current.clientWidth * aspectRatio;
                    const canvasHeight = ref.current.clientHeight * aspectRatio;

                    const base64Image = await toPng(ref.current, { canvasWidth, canvasHeight });

                    if (useDownloadImage) {
                        // Download image
                        const link = document.createElement('a');
                        link.href = base64Image;
                        link.download = PARLAY_IMAGE_NAME;
                        document.body.appendChild(link);
                        setTimeout(
                            () => {
                                link.click();
                            },
                            isIos() ? IOS_DOWNLOAD_DELAY : 0 // fix for iOS
                        );
                        setTimeout(
                            () => {
                                // Cleanup the DOM
                                document.body.removeChild(link);
                            },
                            isIos() ? 3 * IOS_DOWNLOAD_DELAY : 0 // fix for iOS
                        );
                    } else {
                        // Save to clipboard
                        const b64Blob = (await fetch(base64Image)).blob();
                        const cbi = new ClipboardItem({
                            'image/png': b64Blob,
                        });
                        await navigator.clipboard.write([cbi]); // not supported by FF
                    }

                    if (ref.current === null) {
                        return;
                    }

                    const twitterLinkWithStatusMessage =
                        LINKS.TwitterTweetStatus +
                        TWITTER_MESSAGE_CHECKOUT +
                        LINKS.Markets.Home +
                        (useDownloadImage ? TWITTER_MESSAGE_UPLOAD : TWITTER_MESSAGE_PASTE);

                    // Mobile requires user action in order to open new window, it can't open in async call, so adding <a>
                    isMobile
                        ? isIos()
                            ? setTimeout(() => {
                                  toast.update(
                                      toastIdParam,
                                      getSuccessToastOptions(t('common.flex-card.click-open-twitter'), toastIdParam)
                                  );
                              }, IOS_DOWNLOAD_DELAY)
                            : toast.update(
                                  toastIdParam,
                                  getSuccessToastOptions(t('common.flex-card.click-open-twitter'), toastIdParam)
                              )
                        : toast.update(
                              toastIdParam,
                              getSuccessToastOptions(
                                  !useDownloadImage
                                      ? t('common.flex-card.image-in-clipboard')
                                      : t('common.flex-card.open-twitter'),
                                  toastIdParam
                              )
                          );

                    if (!isMobile) {
                        setTimeout(() => {
                            window.open(twitterLinkWithStatusMessage);
                        }, toastBasicProperties.autoClose);
                    }
                    onClose();
                } catch (e) {
                    console.log(e);
                    setIsLoading(false);
                    toast.update(
                        toastIdParam,
                        getErrorToastOptions(t('common.flex-card.save-image-error'), toastIdParam)
                    );
                }
            }
        },
        [isLoading, useDownloadImage, isMobile, t, onClose]
    );

    const onTwitterShareClick = () => {
        if (!isLoading) {
            trackEvent({
                category: 'share-ticket-modal',
                action: 'click-on-share-tw-icon',
            });

            if (isMetamaskBrowser) {
                // Metamask dosn't support image download neither clipboard.write
                toast.error(t('market.toast-message.metamask-not-supported'), toastBasicProperties);
            } else {
                const id = toast.loading(
                    useDownloadImage ? t('common.flex-card.download-image') : t('common.flex-card.save-image')
                );
                setToastId(id);
                setIsLoading(true);

                // If image creation is not postponed with timeout toaster is not displayed immediately, it is rendered in parallel with toPng() execution.
                // Function toPng is causing UI to freez for couple of seconds and there is no notification message during that time, so it confuses user.
                setTimeout(() => {
                    saveImageAndOpenTwitter(id);
                }, 300);
            }
        }
    };

    const onModalClose = () => {
        if (isLoading) {
            toast.update(toastId, getErrorToastOptions(t('common.flex-card.save-image-cancel'), toastId));
        }
        onClose();
    };

    return (
        <ReactModal
            isOpen
            onRequestClose={onModalClose}
            shouldCloseOnOverlayClick={true}
            style={customStyles}
            contentElement={(props, children) => (
                <>
                    <div {...props}>{children}</div>
                    {isMobile && <CloseIcon className={`icon icon--x-sign`} onClick={onClose} />}
                </>
            )}
        >
            <Container ref={ref}>
                {!isMobile && <CloseIcon className={`icon icon--x-sign`} onClick={onClose} />}
                {type == 'potential' && (
                    <PotentialWinCard
                        type={type}
                        currencyKey={currencyKey}
                        position={position}
                        strikeDate={strikeDate}
                        strikePrice={strikePrice}
                        leftPrice={leftPrice}
                        rightPrice={rightPrice}
                        buyIn={buyIn}
                        payout={payout}
                    />
                )}
                {type == 'resolved' && (
                    <ResolvedWinCard
                        type={type}
                        currencyKey={currencyKey}
                        position={position}
                        strikeDate={strikeDate}
                        strikePrice={strikePrice}
                        leftPrice={leftPrice}
                        rightPrice={rightPrice}
                        buyIn={buyIn}
                        payout={payout}
                    />
                )}
                {type == 'potential-speed' && (
                    <SpeedMarketPotentialWinCard
                        type={type}
                        currencyKey={currencyKey}
                        position={position}
                        strikeDate={strikeDate}
                        strikePrice={strikePrice}
                        marketDuration={12}
                        buyIn={buyIn}
                        payout={payout}
                    />
                )}
                {type == 'resolved-speed' && (
                    <SpeedMarketResolvedWinCard
                        type={type}
                        currencyKey={currencyKey}
                        position={position}
                        strikeDate={strikeDate}
                        strikePrice={strikePrice}
                        marketDuration={12}
                        buyIn={buyIn}
                        payout={payout}
                    />
                )}
                <TwitterShare disabled={isLoading} onClick={onTwitterShareClick}>
                    <TwitterIcon className="icon-home icon-home--twitter-x" disabled={isLoading} fontSize={'30px'} />
                    <TwitterShareLabel>{t('common.flex-card.share')}</TwitterShareLabel>
                </TwitterShare>
            </Container>
        </ReactModal>
    );
};

// Aspect ratio is important for Twitter: horizontal (Simple View) 2:1 and vertical min 3:4
const Container = styled(FlexDivColumnCentered)`
    width: 386px;
    max-height: 515px;
    /* padding: 15px; */
    /* flex: none; */
    /* background: linear-gradient(180deg, #303656 0%, #1a1c2b 100%); */
    /* border-radius: 15px; */
    @media (max-width: 950px) {
        width: 357px;
        max-height: 476px;
    }
`;

const CloseIcon = styled.i`
    position: absolute;
    top: -20px;
    right: -20px;
    font-size: 20px;
    cursor: pointer;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: 950px) {
        top: 10px;
        right: 10px;
    }
`;

const TwitterShare = styled(FlexDivColumnCentered)<{ disabled?: boolean }>`
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -80px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 55px;
    border-radius: 15px;
    background: ${(props) => props.theme.button.background.primary};
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
    opacity: ${(props) => (props.disabled ? '0.4' : '1')};
`;

const TwitterIcon = styled.i<{ disabled?: boolean; fontSize?: string; padding?: string }>`
    font-size: ${(props) => (props.fontSize ? props.fontSize : '20px')};
    color: ${(props) => props.theme.button.textColor.primary};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    opacity: ${(props) => (props.disabled ? '0.4' : '1')};
    margin-right: 10px;
    ${(props) => (props.padding ? `padding: ${props.padding};` : '')}
`;

const TwitterShareLabel = styled.span`
    font-weight: 800;
    font-size: 18px;
    line-height: 25px;
    text-transform: uppercase;
    color: ${(props) => props.theme.button.textColor.primary};
`;

export default React.memo(SharePositionModal);
