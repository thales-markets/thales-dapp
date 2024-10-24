import SimpleLoader from 'components/SimpleLoader';
import SPAAnchor from 'components/SPAAnchor';
import TimeRemaining from 'components/TimeRemaining';
import { VAULT_MAP } from 'constants/vault';
import useVaultDataQuery from 'queries/vault/useVaultDataQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { useTheme } from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { formatPercentage, formatPercentageWithSign } from 'thales-utils';
import { RootState, ThemeInterface } from 'types/ui';
import { VaultData } from 'types/vault';
import { buildVaultLink } from 'utils/routes';
import {
    DeprecatedContainer,
    LoaderContainer,
    SpaContainer,
    TitleVaultIcon,
    VaultBottomWrapper,
    VaultContainer,
    VaultInfo,
    VaultInfoContainer,
    VaultInfoLabel,
    VaultSectionDescription,
    VaultSectionIcon,
    VaultSectionTitle,
    VaultTitle,
    VaultTopWrapper,
} from './styled-components';

type VaultOverviewProps = {
    vaultId: string;
};

const VaultOverview: React.FC<VaultOverviewProps> = ({ vaultId }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [lastValidVaultData, setLastValidVaultData] = useState<VaultData | undefined>(undefined);

    const vaultAddress = !!VAULT_MAP[vaultId] ? VAULT_MAP[vaultId].addresses[networkId] : undefined;

    const vaultDataQuery = useVaultDataQuery(vaultAddress, networkId, {
        enabled: isAppReady && !!vaultAddress,
    });

    useEffect(() => {
        if (vaultDataQuery.isSuccess && vaultDataQuery.data) {
            setLastValidVaultData(vaultDataQuery.data);
        }
    }, [vaultDataQuery.isSuccess, vaultDataQuery.data]);

    const vaultData: VaultData | undefined = useMemo(() => {
        if (vaultDataQuery.isSuccess && vaultDataQuery.data) {
            return vaultDataQuery.data;
        }
        return lastValidVaultData;
    }, [vaultDataQuery.isSuccess, vaultDataQuery.data, lastValidVaultData]);

    return (
        <SpaContainer>
            <SPAAnchor href={buildVaultLink(vaultId)}>
                <FlexDivColumn style={{ height: '100%' }}>
                    <VaultContainer>
                        <VaultTitle>
                            <TitleVaultIcon className={`sidebar-icon icon--${vaultId}`} />
                            {t(`vault.${vaultId}.title`)}
                        </VaultTitle>
                        <DeprecatedContainer>{t(`liquidity-pool.deprecated-info`)}</DeprecatedContainer>
                        {!vaultData ? (
                            <LoaderContainer>
                                <SimpleLoader />
                            </LoaderContainer>
                        ) : (
                            <FlexDivColumn>
                                <VaultTopWrapper>
                                    <VaultSectionTitle>
                                        <VaultSectionIcon className={`sidebar-icon icon--strategy`} />
                                        {t('vaults.strategy-label')}
                                    </VaultSectionTitle>
                                    <VaultSectionDescription>
                                        <Trans
                                            i18nKey={`vault.${vaultId}.description`}
                                            components={{
                                                p: <p />,
                                            }}
                                            values={{
                                                odds: formatPercentage(vaultData.priceLowerLimit, 0),
                                                discount: formatPercentage(Math.abs(vaultData.skewImpactLimit), 0),
                                            }}
                                        />
                                    </VaultSectionDescription>
                                    <VaultSectionTitle>
                                        <VaultSectionIcon className={`sidebar-icon icon--risks`} />
                                        {t('vaults.risks-label')}
                                    </VaultSectionTitle>
                                    <VaultSectionDescription>
                                        <Trans
                                            i18nKey={`vault.${vaultId}.risks`}
                                            components={{
                                                p: <p />,
                                            }}
                                            values={{
                                                utilizationRate: formatPercentage(vaultData.utilizationRate, 0),
                                                allocationLimitsPerMarketPerRound: formatPercentage(
                                                    vaultData.allocationLimitsPerMarketPerRound
                                                ),
                                                odds: formatPercentage(vaultData.priceLowerLimit, 0),
                                            }}
                                        />
                                    </VaultSectionDescription>
                                </VaultTopWrapper>
                                <VaultBottomWrapper>
                                    <VaultInfoContainer>
                                        <VaultInfoLabel>{t('vault.pnl.lifetime-pnl')}:</VaultInfoLabel>
                                        <VaultInfo
                                            color={
                                                vaultData.lifetimePnl === 0
                                                    ? theme.textColor.primary
                                                    : vaultData.lifetimePnl > 0
                                                    ? theme.textColor.quaternary
                                                    : theme.textColor.tertiary
                                            }
                                        >
                                            {formatPercentageWithSign(vaultData.lifetimePnl)}
                                        </VaultInfo>
                                    </VaultInfoContainer>
                                    <VaultInfoContainer>
                                        <VaultInfoLabel>{t('vault.round-end-label')}:</VaultInfoLabel>
                                        <VaultInfo color={theme.textColor.quaternary}>
                                            {vaultData.isRoundEnded ? (
                                                t('vault.round-ended-label')
                                            ) : (
                                                <TimeRemaining
                                                    end={vaultData.roundEndTime}
                                                    fontSize={20}
                                                    showFullCounter
                                                />
                                            )}
                                        </VaultInfo>
                                    </VaultInfoContainer>
                                </VaultBottomWrapper>
                            </FlexDivColumn>
                        )}
                    </VaultContainer>
                </FlexDivColumn>
            </SPAAnchor>
        </SpaContainer>
    );
};

export default VaultOverview;
