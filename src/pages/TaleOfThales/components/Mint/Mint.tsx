import React from 'react';
import styled from 'styled-components';
import { NFT_COLLECTIONS } from './constants';
import { ReactComponent as NFTContainerImage } from 'assets/images/tale-of-thales-nft-container.svg';
import { ReactComponent as PixelTooltipContainer } from 'assets/images/pixel-tooltip-container.svg';
import { Tooltip } from '@material-ui/core';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';

const Mint: React.FC = () => {
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
                                        <StyledPixelTooltipContainer />
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
                                            <StyledNFTContainerImage />
                                            <NFTTitle>{item.name}</NFTTitle>
                                            <NFTImage src={item.src} />
                                        </NFTContainer>
                                        <Button>Mint</Button>
                                    </Item>
                                );
                            })}
                            <CollectionButton>Mint Collection</CollectionButton>
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

const StyledNFTContainerImage = styled(NFTContainerImage)`
    position: absolute;
    z-index: 0;
`;

const Button = styled.button`
    font-family: basis33 !important;
    background: linear-gradient(90.42deg, #d6d0ab 18.36%, #aea992 87.84%);
    border: 2px dashed #04045a;
    color: var(--background);
    width: 100%;
    height: 35px;
    font-size: 25px;
    text-transform: uppercase;
    margin-top: 10px;
    cursor: pointer;
`;

const CollectionButton = styled.button`
    font-family: basis33 !important;
    background: linear-gradient(90.42deg, #d6d0ab 18.36%, #aea992 87.84%);
    border: 2px dashed #04045a;
    color: var(--background);
    width: 350px;
    height: 35px;
    font-size: 25px;
    text-transform: uppercase;
    cursor: pointer;
    transform: translateY(-50%);
    margin-left: auto;
`;

const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    () => ({
        [`& .MuiTooltip-tooltip`]: {
            backgroundColor: 'transparent',
            color: 'white',
            maxWidth: 332,
        },
    })
);

const StyledPixelTooltipContainer = styled(PixelTooltipContainer)`
    position: absolute;
    top: -67px;
    z-index: -1;
`;

const TooltipContent = styled.div`
    font-family: basis33 !important;
    font-size: 25px;
    line-height: 120%;
    text-align: justify;
    width: 332px;
    height: 167px;
    padding: 10px 10px 10px 15px;
`;

const StyledInfoIcon = styled(InfoIcon)`
    margin: 0 0 5px 5px;
`;

export default Mint;
