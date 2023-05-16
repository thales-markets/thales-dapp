import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn } from 'theme/common';

export const SpaContainer = styled(FlexDivColumn)`
    background: linear-gradient(201.59deg, var(--color-primary) 37.82%, var(--color-secondary) 107.42%);
    border: 2px solid var(--color-highlight);
    border-radius: 15px;
    transition: 0.2s all;
    &:hover {
        transform: scale(1.1);
    }
    cursor: pointer;
    :not(:last-child) {
        margin-right: 25px;
    }
    @media (max-width: 767px) {
        width: 100%;
        :not(:last-child) {
            margin-right: 0;
            margin-bottom: 20px;
        }
    }
    align-self: stretch;
    a {
        height: 100%;
    }
`;

export const VaultContainer = styled(FlexDivColumn)`
    align-items: start;
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    padding: 30px 40px 30px 40px;
    @media (max-width: 767px) {
        padding: 20px 20px 20px 20px;
    }
    height: 100%;
`;

export const VaultTopWrapper = styled(FlexDivColumn)``;

export const VaultBottomWrapper = styled(FlexDivColumn)`
    align-self: center;
    flex: initial;
    margin-top: 10px;
`;

export const VaultTitle = styled.span`
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    line-height: 25px;
    margin-bottom: 10px;
    width: 100%;
    padding-bottom: 20px;
    border-bottom: 2px solid rgba(100, 217, 254, 0.4);
    text-align: center;
    color: var(--color-highlight);
`;

export const VaultSectionTitle = styled.span`
    text-align: start;
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 20px;
    margin-top: 20px;
`;

export const VaultSectionDescription = styled.span`
    text-align: justify;
    font-weight: 400;
    font-size: 16px;
`;

export const LoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 250px;
    width: 100%;
`;

export const VaultInfoContainer = styled(FlexDivColumn)`
    align-items: center;
    font-size: 18px;
    span {
        font-size: 20px;
        font-weight: 600;
        color: var(--color-highlight);
    }
    margin-top: 10px;
`;

export const VaultInfoLabel = styled.p``;

export const VaultInfo = styled.p<{ color: string }>`
    color: ${(props) => props.color};
    font-weight: 600;
    font-size: 20px;
    margin-top: 4px;
`;

export const TitleVaultIcon = styled.i`
    font-weight: 400;
    font-size: 28px;
    margin-right: 8px;
    top: -2px;
    position: relative;
    color: var(--color-highlight);
`;

export const VaultSectionIcon = styled.i`
    font-weight: 400;
    font-size: 25px;
    margin-right: 8px;
    top: -2px;
    position: relative;
`;
