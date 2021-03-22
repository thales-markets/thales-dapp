import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { getEtherscanTxLink } from 'utils/etherscan';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';

type ViewEtherscanLinkProps = {
    isDisabled?: boolean;
    hash: string;
};

export const ViewEtherscanLink: React.FC<ViewEtherscanLinkProps> = ({ hash }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    return (
        <>
            <a href={getEtherscanTxLink(networkId, hash)} target="_blank" rel="noreferrer">
                {t('common.transaction.view')}
            </a>
            <ArrowHyperlinkIcon width="8" height="8" />
        </>
    );
};

export default ViewEtherscanLink;
