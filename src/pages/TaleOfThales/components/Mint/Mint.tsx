import React from 'react';
import styled from 'styled-components';
import { NFT_COLLECTIONS } from './constants';
import NFTContainerImage from 'assets/images/ToT_square.png';
import NFTOwnedContainerImage from 'assets/images/ToT_square_owned.png';
import PixelTooltipContainer from 'assets/images/ToT_rectangle.png';
import { Tooltip } from '@material-ui/core';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';
import useNFTCollectionsQuery from 'queries/taleOfThales/useNFTCollectionsQuery';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import snxJSConnector from 'utils/snxJSConnector';
import { toast } from 'react-toastify';
import { getErrorToastOptions, getSuccessToastOptions } from 'constants/ui';
import { useTranslation } from 'react-i18next';
import useNFTBalancesQuery from 'queries/taleOfThales/useNFTBalancesQuery';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';

const Mint: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector(getWalletAddress);
    const networkId = useSelector(getNetworkId);
    const collectionsQuery = useNFTCollectionsQuery(walletAddress || '', networkId, {
        enabled: isAppReady && !!walletAddress,
    });
    const collectionEligibility = collectionsQuery.isSuccess ? collectionsQuery.data : {};
    const NFTBalancesQuery = useNFTBalancesQuery(walletAddress || '', networkId, {
        enabled: isAppReady && !!walletAddress,
    });
    const NFTBalancesMap = NFTBalancesQuery.isSuccess ? NFTBalancesQuery.data : {};
    const handleMintCollection = async (collectionId: number) => {
        const id = toast.loading(t('tale-of-thales.mint.loading'));
        try {
            const { taleOfThalesNFTContract } = snxJSConnector as any;
            const taleOfThalesNFTContractWithSigner = taleOfThalesNFTContract.connect((snxJSConnector as any).signer);

            const tx = await taleOfThalesNFTContractWithSigner.mintCollection(collectionId);
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(id, getSuccessToastOptions(t('tale-of-thales.mint.successfully-minted')));
            }
        } catch (e) {
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
        }
    };

    const handleMintItem = async (itemId: number) => {
        const id = toast.loading(t('tale-of-thales.mint.loading'));
        try {
            const { taleOfThalesNFTContract } = snxJSConnector as any;
            const taleOfThalesNFTContractWithSigner = taleOfThalesNFTContract.connect((snxJSConnector as any).signer);
            const tx = await taleOfThalesNFTContractWithSigner.mintItem(itemId);
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(id, getSuccessToastOptions(t('tale-of-thales.mint.successfully-minted')));
            }
        } catch (e) {
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
        }
    };

    return (
        <Container>
            {NFT_COLLECTIONS.map((collection, index) => {
                return (
                    <CollectionContainer key={index}>
                        <CollectionTitleContainer>
                            <CollectionTitle>{collection.name}</CollectionTitle>
                            <StyledTooltip
                                placement="right"
                                title={
                                    <>
                                        <StyledPixelTooltipContainer src={PixelTooltipContainer} />
                                        <TooltipContent>{collection.condition}</TooltipContent>
                                    </>
                                }
                            >
                                <StyledInfoIcon />
                            </StyledTooltip>
                        </CollectionTitleContainer>
                        <CollectionItemsContainer>
                            {collection.items.map((item, index) => {
                                return (
                                    <Item key={index}>
                                        <NFTContainer>
                                            {NFTBalancesMap[item.itemId] ? (
                                                <StyledNFTContainerImage src={NFTOwnedContainerImage} />
                                            ) : (
                                                <StyledNFTContainerImage src={NFTContainerImage} />
                                            )}
                                            <NFTTitle>{item.name}</NFTTitle>
                                            <NFTImage src={item.src} />
                                        </NFTContainer>
                                        <Button
                                            invisible={NFTBalancesMap[item.itemId]}
                                            onClick={() => handleMintItem(item.itemId)}
                                            disabled={!collectionEligibility[collection.collectionId]}
                                        >
                                            Mint
                                        </Button>
                                    </Item>
                                );
                            })}
                            <CollectionButton
                                invisible={collection.items.every((item) => NFTBalancesMap[item.itemId])}
                                onClick={() => handleMintCollection(collection.collectionId)}
                                disabled={!collectionEligibility[collection.collectionId]}
                            >
                                Mint Collection
                            </CollectionButton>
                        </CollectionItemsContainer>
                    </CollectionContainer>
                );
            })}
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 40px;
`;

const CollectionContainer = styled.div`
    margin-bottom: 40px;
`;

const CollectionItemsContainer = styled.div`
    display: flex;
    align-items: center;
`;

const CollectionTitleContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const CollectionTitle = styled.span`
    font-family: basis33 !important;
    color: var(--primary-color);
    text-transform: uppercase;
    font-size: 28px;
    line-height: 105%;
    letter-spacing: 2px;
`;

const NFTTitle = styled.span`
    font-family: basis33 !important;
    color: var(--background);
    z-index: 1;
    text-transform: uppercase;
    font-size: 25px;
`;

const NFTContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 187px;
    height: 166px;
`;

const Item = styled.div`
    margin-right: 13px;
`;

const NFTImage = styled.img`
    width: 80px;
    z-index: 1;
`;

const StyledNFTContainerImage = styled.img`
    position: absolute;
    z-index: 0;
    width: 170px;
`;

const Button = styled.button<{ invisible?: boolean }>`
    font-family: basis33 !important;
    background: #e1b689;
    border: 2px dashed #04045a;
    color: var(--background);
    width: 100%;
    height: 35px;
    font-size: 25px;
    text-transform: uppercase;
    margin-top: 10px;
    cursor: pointer;
    visibility: ${(props) => (props.invisible ? 'hidden' : 'visible')};
    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;

const CollectionButton = styled.button<{ invisible?: boolean }>`
    font-family: basis33 !important;
    background: #e1b689;
    border: 2px dashed #04045a;
    color: var(--background);
    width: 350px;
    height: 35px;
    font-size: 25px;
    text-transform: uppercase;
    cursor: pointer;
    transform: translateY(-50%);
    margin-left: auto;
    visibility: ${(props) => (props.invisible ? 'hidden' : 'visible')};
    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;

const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    () => ({
        [`& .MuiTooltip-tooltip`]: {
            backgroundColor: 'transparent',
            color: 'black',
            maxWidth: 332,
        },
    })
);

const StyledPixelTooltipContainer = styled.img`
    position: absolute;
    top: -30px;
    z-index: -1;
    width: 335px;
    height: 200px;
`;

const TooltipContent = styled.div`
    font-family: basis33 !important;
    font-size: 25px;
    line-height: 120%;
    width: 332px;
    height: 167px;
    padding: 10px 10px 10px 15px;
`;

const StyledInfoIcon = styled(InfoIcon)`
    margin: 0 0 5px 5px;
`;

export default Mint;
