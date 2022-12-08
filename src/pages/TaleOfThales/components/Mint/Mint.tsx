import Button from 'components/Button';
import React from 'react';
import styled from 'styled-components';
import { NFT_LIST } from './constants';

const Mint: React.FC = () => {
    const defaultButtonProps = {
        padding: '3px 35px',
        active: true,
        margin: '15px auto 0 auto',
        hoverShadow: 'var(--button-shadow)',
        fontSize: '16px',
    };
    return (
        <Grid>
            {NFT_LIST.map((nft, index) => {
                return (
                    <NFTContainer key={index}>
                        <NFTImage src={nft.src} />
                        <Button {...defaultButtonProps}>Mint</Button>
                    </NFTContainer>
                );
            })}
        </Grid>
    );
};

const Grid = styled.div`
    display: grid;
    width: 100%;
    grid-template-columns: auto auto auto auto;
    padding: 40px;
    row-gap: 40px;
`;

const NFTContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const NFTImage = styled.img`
    width: 100px;
`;

export default Mint;
