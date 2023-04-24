export const isMobile = () => window.innerWidth < 768;

export const isMetamask = async () => {
    if (!window.ethereum) {
        return false;
    }
    const clientVersion = await window.ethereum.request({
        method: 'web3_clientVersion',
    });
    const isMetamaskClientVersion = clientVersion.split('/')[0] === 'MetaMask';

    return window && window.ethereum.isMetaMask && isMetamaskClientVersion;
};

export const isIos = () => {
    const userAgent = navigator.userAgent || window.opera;
    return (
        (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) ||
        // iPad on iOS 13 detection
        (userAgent.includes('Mac') && 'ontouchend' in document)
    );
};

export const isAndroid = () => {
    const userAgent = navigator.userAgent || window.opera;
    return /android/i.test(userAgent);
};
